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
            wsConnected: false
        });

        // 1. Lắng nghe Keyboard Emulation (Bus)
        useBus(this.barcodeService.bus, "barcode_scanned", (ev) => {
            const barcode = ev.detail.barcode;
            this.state.lastScannedBarcode = barcode;
            
            this.state.scanHistory.unshift({
                barcode: barcode,
                source: "Keyboard HID",
                time: new Date().toLocaleTimeString() + "." + new Date().getMilliseconds().toString().padStart(3, '0')
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
        this.ws = new WebSocket("ws://127.0.0.1:8181");
        
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
        if (this.ws && this.state.wsConnected) {
            if (mode === "WS") {
                this.ws.send(JSON.stringify({ action: "READ_RFID" }));
            } else if (mode === "KEYBOARD") {
                this.ws.send(JSON.stringify({ action: "READ_RFID_KEYBOARD" }));
            }
        } else {
            alert("WebSocket is not connected!");
        }
    }
}

registry.category("actions").add("test_barcode_service.main_app", BarcodeTestApp);
