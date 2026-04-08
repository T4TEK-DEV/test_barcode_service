from odoo import fields, models

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    barcode_max_time_ms = fields.Integer(
        related='company_id.barcode_max_time_ms', readonly=False,
        string="Max Time Between Keys (ms)",
        help="Time allowed between keystrokes to be considered a barcode scan."
    )
    barcode_ignore_editable = fields.Boolean(
        related='company_id.barcode_ignore_editable', readonly=False,
        string="Ignore Editable Elements",
        help="If checked, barcode scanning will be ignored when the user is typing in an input field."
    )
    barcode_batch_delimiter = fields.Char(
        related='company_id.barcode_batch_delimiter', readonly=False,
        string="Batch Delimiter",
        help="Delimiter to split batch keyboard scans into multiple barcodes (e.g. '|'). Leave empty to disable."
    )
    barcode_batch_delay_ms = fields.Integer(
        related='company_id.barcode_batch_delay_ms', readonly=False,
        string="Batch Delay (ms)",
        help="Wait time to collect rapid-fire barcodes before processing. 0 = process each barcode immediately."
    )
