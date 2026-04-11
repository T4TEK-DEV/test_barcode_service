{
    'name': 'Test Barcode Service',
    'version': '1.0',
    'category': 'Hidden',
    'summary': 'Test barcode scanner service',
    'depends': ['web', 'barcodes', 't4_sequential_auto_input', 't4_passivehid_bridge'],
    'data': [
        'security/ir.model.access.csv',
        'views/test_views.xml',
        'views/menus.xml',
        'views/res_config_settings_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'test_barcode_service/static/src/barcode_test_app.xml',
            'test_barcode_service/static/src/barcode_test_app.js',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
