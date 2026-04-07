# AI Agent Prompting Rules

When modifying this repository, adhere strictly to the following guidelines:

1. **Odoo Upgrades**: If you modify `Python` or `XML` files, you must restart the Odoo App Server and run `-u test_barcode_service` to commit the updates into the database cache. Modifying `JS` does not strictly require restarts if Dev Mode (`?debug=assets`) is on, but a cache refresh is needed.
2. **OWL Paradigm**: Do not use raw DOM manipulations (e.g. `document.getElementById`). Always use `<t t-if="..." />` and `t-model` in XML paired with `this.state` in OWL Components.
3. **Core Patching Rules**: Remember that `@web/core/utils/patch` modifies the core behavior for ALL Odoo apps. Only override what's strictly necessary. Keep patches slim.
4. **Timeouts**: When dealing with external `WebSocket` delays, prefer standard `setTimeout` combined with unmounting listeners in `onWillDestroy` to prevent memory leaks in Single Page Applications.
