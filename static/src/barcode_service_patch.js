/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { barcodeService } from "@barcodes/barcode_service";
import { session } from "@web/session";
import { EventBus, whenReady } from "@odoo/owl";
import { isBrowserChrome, isMobileOS } from "@web/core/browser/feature_detection";

function isEditable(element) {
    if (!element || !element.matches) return false;
    return element.matches('input,textarea,[contenteditable="true"]');
}

function makeBarcodeInput() {
    const inputEl = document.createElement('input');
    inputEl.setAttribute("style", "position:fixed;top:50%;transform:translateY(-50%);z-index:-1;opacity:0");
    inputEl.setAttribute("autocomplete", "off");
    inputEl.setAttribute("inputmode", "none"); 
    inputEl.classList.add("o-barcode-input");
    inputEl.setAttribute('name', 'barcode');
    return inputEl;
}

patch(barcodeService, {
    start() {
        const bus = new EventBus();
        let timeout = null;

        let bufferedBarcode = "";
        let currentTarget = null;
        let barcodeInput = null;

        let barcodeBuffer = [];
        let batchFlushTimeout = null;

        function handleBarcode(barcode, target) {
            bus.trigger('barcode_scanned', {barcode,target});
            if (target && target.getAttribute && target.getAttribute('barcode_events') === "true") {
                const barcodeScannedEvent = new CustomEvent("barcode_scanned", { detail: { barcode, target } });
                target.dispatchEvent(barcodeScannedEvent);
            }
        }

        function flushBarcodeBuffer() {
            const items = [...barcodeBuffer];
            barcodeBuffer = [];
            for (const { barcode, target } of items) {
                handleBarcode(barcode, target);
            }
        }

        function enqueueBarcodes(barcodes, target) {
            const batchDelay = session.barcode_batch_delay_ms ?? 0;
            if (batchDelay <= 0) {
                for (const barcode of barcodes) {
                    handleBarcode(barcode, target);
                }
                return;
            }
            for (const barcode of barcodes) {
                barcodeBuffer.push({ barcode, target });
            }
            clearTimeout(batchFlushTimeout);
            batchFlushTimeout = setTimeout(flushBarcodeBuffer, batchDelay);
        }

        function checkBarcode(ev) {
            let str = barcodeInput ? barcodeInput.value : bufferedBarcode;
            str = barcodeService.cleanBarcode(str);
            if (str.length >= 3) {
                if (ev) {
                    ev.preventDefault();
                }
                const delimiter = session.barcode_batch_delimiter || "";
                let barcodes;
                if (delimiter && str.includes(delimiter)) {
                    barcodes = str.split(delimiter).filter(b => b.length >= 1);
                } else {
                    barcodes = [str];
                }
                enqueueBarcodes(barcodes, currentTarget);
            }
            if (barcodeInput) {
                barcodeInput.value = "";
            }
            bufferedBarcode = "";
            currentTarget = null;
        }

        function keydownHandler(ev) {
            if (!ev.key) {
                return;
            }
            const isSpecialKey = !['Control', 'Alt'].includes(ev.key) && (ev.key.length > 1 || ev.metaKey);
            const isEndCharacter = ev.key.match(/(Enter|Tab)/);

            if (isSpecialKey && !isEndCharacter) {
                return;
            }

            currentTarget = ev.target;
            
            // MAGIC CHECK INJECTED HERE: Check session properties from ir.http
            const ignoreEditable = session.barcode_ignore_editable ?? true;

            if (ignoreEditable && currentTarget !== barcodeInput && isEditable(currentTarget) &&
                (!currentTarget.dataset || !currentTarget.dataset.enableBarcode) &&
                currentTarget.getAttribute("barcode_events") !== "true") {
                currentTarget = null;
                return;
            }

            clearTimeout(timeout);
            if (isEndCharacter) {
                checkBarcode(ev);
            } else {
                bufferedBarcode += ev.key;
                const maxTime = session.barcode_max_time_ms ?? barcodeService.maxTimeBetweenKeysInMs;
                timeout = setTimeout(checkBarcode, maxTime);
            }
        }

        function mobileChromeHandler(ev) {
            if (ev.key === "Unidentified") {
                return;
            }
            if (document.activeElement && !document.activeElement.matches('input:not([type]), input[type="text"], textarea, [contenteditable], ' +
                '[type="email"], [type="number"], [type="password"], [type="tel"], [type="search"]')) {
                if(barcodeInput) barcodeInput.focus();
            }
            keydownHandler(ev);
        }

        function pasteHandler(ev) {
            const delimiter = session.barcode_batch_delimiter || "";
            if (!delimiter) return;

            const text = (ev.clipboardData || window.clipboardData)?.getData("text");
            if (!text || !text.includes(delimiter)) return;

            ev.preventDefault();
            ev.stopPropagation();

            currentTarget = ev.target;
            const barcodes = text.split(delimiter).filter(b => b.length >= 1);
            enqueueBarcodes(barcodes, currentTarget);

            bufferedBarcode = "";
            currentTarget = null;

            navigator.clipboard.writeText("").catch(() => {});
        }

        whenReady(() => {
            const isMobileChrome = isMobileOS() && isBrowserChrome();
            if (isMobileChrome) {
                barcodeInput = makeBarcodeInput();
                document.body.appendChild(barcodeInput);
            }
            const handler = isMobileChrome ? mobileChromeHandler : keydownHandler;
            document.body.addEventListener('keydown', handler);
            document.body.addEventListener('paste', pasteHandler, true);
        });

        return {
            bus,
        };
    }
});
