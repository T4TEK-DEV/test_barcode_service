from odoo import fields, models

class ResCompany(models.Model):
    _inherit = 'res.company'

    barcode_max_time_ms = fields.Integer(string="Barcode Scanner Max Time (ms)", default=150)
    barcode_ignore_editable = fields.Boolean(string="Ignore Input Fields", default=True)
