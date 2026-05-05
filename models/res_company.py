from odoo import fields, models

class ResCompany(models.Model):
    _inherit = 'res.company'

    barcode_max_time_ms = fields.Integer(string="Barcode Scanner Max Time (ms)", default=150)
    barcode_ignore_editable = fields.Boolean(string="Ignore Input Fields", default=True)
    barcode_batch_delimiter = fields.Char(string="Batch Delimiter", default="|", help="Ký tự dùng để phân tách nhiều mã vạch trong cùng một lần quét. Để trống nếu muốn xử lý từng mã một.")
    barcode_batch_delay_ms = fields.Integer(string="Batch Delay (ms)", default=300, help="Thời gian chờ thêm mã vạch trước khi xử lý (tính bằng mili-giây). Nếu đặt là 0, hệ thống sẽ xử lý mã ngay lập tức.")
