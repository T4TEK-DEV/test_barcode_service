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
