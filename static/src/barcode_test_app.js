/** @odoo-module **/

import { Component, useState, onWillStart, onWillDestroy } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService, useBus } from "@web/core/utils/hooks";

export class BarcodeTestApp extends Component {
    static template = "test_barcode_service.BarcodeTestApp";

    setup() {
        this.barcodeService = useService("barcode");
        
        this.state = useState({
            lastScannedBarcode: "",
            scanHistory: [],
            wsStatus: "Connecting...",
            wsConnected: false,
            isReading: false,
            wsDuration: 1000,
            keyboardDuration: 3000
        });
        
        this.timeoutHandle = null;
        this.triggerTime = null;
        this.firstBarcodeTime = null;
        this.lastBarcodeTime = null;
        this.barcodeCount = 0;

        // 1. Lắng nghe Keyboard Emulation (Bus)
        useBus(this.barcodeService.bus, "barcode_scanned", (ev) => {
            const now = performance.now();
            this.barcodeCount++;
            if (!this.firstBarcodeTime) {
                this.firstBarcodeTime = now;
            }
            this.lastBarcodeTime = now;

            if (this.state.isReading) {
                this.state.isReading = false;
                if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
            }

            const barcode = ev.detail.barcode;
            this.state.lastScannedBarcode = barcode;

            const elapsed = this.triggerTime ? Math.round(now - this.triggerTime) : 0;
            const sinceFirst = this.firstBarcodeTime ? Math.round(now - this.firstBarcodeTime) : 0;

            this.state.scanHistory.unshift({
                barcode,
                source: "Keyboard HID",
                time: new Date().toLocaleTimeString() + "." + new Date().getMilliseconds().toString().padStart(3, '0'),
                elapsed: `+${elapsed}ms`,
                sinceFirst: `+${sinceFirst}ms`,
                index: this.barcodeCount,
            });
        });

        // 2. Lắng nghe WebSocket
        this.ws = null;
        
        onWillStart(() => {
            this.connectWebSocket();
        });

        onWillDestroy(() => {
            if (this.ws) {
                this.ws.close();
            }
        });
    }

    connectWebSocket() {
        this.ws = new WebSocket("ws://127.0.0.1:9001");
        
        this.ws.onopen = () => {
            this.state.wsConnected = true;
            this.state.wsStatus = "Connected";
        };

        this.ws.onclose = () => {
            this.state.wsConnected = false;
            this.state.wsStatus = "Disconnected. Retrying in 3s...";
            setTimeout(() => this.connectWebSocket(), 3000);
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };

        this.ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === "rfid_bulk" && Array.isArray(payload.data)) {
                    if (this.state.isReading) {
                        this.state.isReading = false;
                        if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
                    }
                    
                    // Xử lý nguyên mảng JSON cùng lúc
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString() + "." + now.getMilliseconds().toString().padStart(3, '0');
                    
                    const newItems = payload.data.map(item => ({
                        barcode: item,
                        source: "WebSocket",
                        time: timeStr
                    }));

                    this.state.lastScannedBarcode = `[Batch: ${newItems.length} items]`;
                    this.state.scanHistory = [...newItems, ...this.state.scanHistory];
                }
            } catch (e) {
                console.error("Failed to parse WS message", e);
            }
        };
    }

    triggerRFID(mode) {
        if (!this.ws || !this.state.wsConnected) {
            alert("WebSocket is not connected!");
            return;
        }

        let duration = 1000;
        let action = "";

        if (mode === "WS") {
            action = "READ_RFID";
            duration = this.state.wsDuration;
        } else if (mode === "KEYBOARD") {
            action = "READ_RFID_KEYBOARD";
            duration = this.state.keyboardDuration;
        }

        this.triggerTime = performance.now();
        this.firstBarcodeTime = null;
        this.lastBarcodeTime = null;
        this.barcodeCount = 0;

        this.state.isReading = true;
        this.ws.send(JSON.stringify({ action, duration }));

        if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
        this.timeoutHandle = setTimeout(() => {
            if (this.state.isReading) {
                this.state.isReading = false;
            }
        }, duration + 5000);
    }
}

registry.category("actions").add("test_barcode_service.main_app", BarcodeTestApp);
