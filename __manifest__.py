{
    'name': 'Test Barcode Service',
    'version': '1.0',
    'category': 'Hidden',
    'summary': 'Test barcode scanner service',
    'depends': ['base', 'web', 'barcodes'],
    'data': [
        'views/menus.xml',
        'views/res_config_settings_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'test_barcode_service/static/src/barcode_test_app.xml',
            'test_barcode_service/static/src/barcode_test_app.js',
            'test_barcode_service/static/src/barcode_service_patch.js',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
