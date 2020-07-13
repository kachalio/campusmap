from .base import *

DEBUG = False
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'read_default_file' : BASE_DIR + '/my.cnf',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
         },
    }
}

STATIC_ROOT = "/home/campus/static"

STATICFILES_DIRS=[]
