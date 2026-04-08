# -*- coding: utf-8 -*-
from odoo import models, fields


class BarcodeTest(models.TransientModel):
    _name = 't4.barcode.test'
    _description = 'Barcode Service Test'

    # Basic fields - used across all test scenarios
    name = fields.Char(string="Tên")
    barcode = fields.Char(string="Barcode")
    serial = fields.Char(string="Serial")
    rfid_tag = fields.Char(string="RFID Tag")

    # Extended fields - active device (HID) test scenarios
    lot_number = fields.Char(string="Lot Number")
    product_code = fields.Char(string="Product Code")
    location_barcode = fields.Char(string="Location Barcode")
    manufacturer_part = fields.Char(string="Mã nhà sản xuất")
    supplier_part = fields.Char(string="Mã nhà cung cấp")
    description = fields.Text(string="Mô tả")

    # Numeric/type fields - data type coercion tests
    quantity = fields.Integer(string="Số lượng")
    weight = fields.Float(string="Trọng lượng")

    # Metadata fields
    note = fields.Text(string="Ghi chú")
    scan_count = fields.Integer(string="Scan Count", default=0)
    is_verified = fields.Boolean(string="Verified", default=False)
