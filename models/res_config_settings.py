from odoo import fields, models

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    barcode_max_time_ms = fields.Integer(
        related='company_id.barcode_max_time_ms', readonly=False,
        string="Max Time Between Keys (ms)",
        help="Thời gian chờ tối đa giữa các lần bấm phím để hệ thống nhận diện là một thao tác quét mã vạch."
    )
    barcode_ignore_editable = fields.Boolean(
        related='company_id.barcode_ignore_editable', readonly=False,
        string="Ignore Editable Elements",
        help="Nếu được chọn, hệ thống sẽ bỏ qua tín hiệu quét mã vạch khi bạn đang gõ văn bản trong một ô nhập liệu."
    )
    barcode_batch_delimiter = fields.Char(
        related='company_id.barcode_batch_delimiter', readonly=False,
        string="Batch Delimiter",
        help="Ký tự dùng để phân tách khi quét nhiều mã vạch cùng lúc. Để trống nếu không muốn gộp mã."
    )
    barcode_batch_delay_ms = fields.Integer(
        related='company_id.barcode_batch_delay_ms', readonly=False,
        string="Batch Delay (ms)",
        help="Thời gian chờ gộp mã vạch liên tục trước khi xử lý. Nếu đặt là 0, mã sẽ được xử lý ngay lập tức."
    )
