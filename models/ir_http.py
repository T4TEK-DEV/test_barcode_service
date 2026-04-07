from odoo import models

class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        result = super(IrHttp, self).session_info()
        company = self.env.company
        result.update({
            'barcode_max_time_ms': company.barcode_max_time_ms if company else 150,
            'barcode_ignore_editable': company.barcode_ignore_editable if company else True,
        })
        return result
