from odoo import fields, models

class ResCompany(models.Model):
    _inherit = 'res.company'

    barcode_max_time_ms = fields.Integer(string="Barcode Scanner Max Time (ms)", default=150)
    barcode_ignore_editable = fields.Boolean(string="Ignore Input Fields", default=True)
    barcode_batch_delimiter = fields.Char(string="Batch Delimiter", default="|", help="Delimiter used to separate multiple barcodes in a single keyboard scan. Leave empty to disable batch mode.")
    barcode_batch_delay_ms = fields.Integer(string="Batch Delay (ms)", default=300, help="Time to wait for more barcodes before processing the batch. 0 = no batching (process immediately).")
