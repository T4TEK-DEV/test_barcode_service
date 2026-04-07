# Technical Stack & Architecture

## Tech Stack
- **Framework**: Odoo 19
- **Frontend**: OWL (Odoo Web Library)
- **Language**: Python (Backend configurations), JavaScript & XML (Frontend Component Engine)

## Architecture
- **Dependency Overrides**: Modifies core `@barcodes/barcode_service` dynamically through OWL's `patch` utility.
- **State Management**:
  - Leverages standard Odoo `ir.http` to inject backend configuration properties (`barcode_max_time_ms`, etc.) directly into the `session` object on page load.
  - The `BarcodeTestApp` Component utilizes `useState()` to maintain WebSocket and Keyboard history arrays reactively.
- **Asynchronous Connectivity**: Uses native `WebSocket` API. Contains standard reconnection buffers and manual timeout closures to assure graceful fallback failures.
