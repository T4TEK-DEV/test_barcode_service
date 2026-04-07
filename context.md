# Business Context & Use Cases

## The Ecosystem
Odoo natively handles Barcodes by tracking keyboard keystroke speed gaps (typically under 150ms). This architecture is limited and blocks scans from proceeding if the user is typing in a text field (`isEditable` restriction). Moreover, handling RFID mass-reads via keyboard logic freezes the entire DOM.

## Modifiable Customization
This module allows System Administrators to dynamically relax or restrict the Native Odoo parameters via *Settings > General Settings*:
- Change Keydown Timeout limits to capture varying hardware profiles.
- Toggle ignoring Keyboard inputs on text fields.

## The Hybrid Interface
This module functions as the Visual Bridge for the Warehouse RFID project. It presents a dedicated **Testing App** proving the dual-latency capability. Users can visually measure network ping delays over WebSockets vs sequential keystroke delays over Keyboard Emulation to qualify the Local Hardware Gateway integration.
