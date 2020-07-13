from import_export.admin import ImportExportModelAdmin
from django.contrib import admin

from .models import Site, Closet, ClosetObject, FiberRun, Server, ClosetObjectType
# Register your models here.

# admin.site.register(Site)
@admin.register(Site)
class SiteAdmin(ImportExportModelAdmin):
    pass

@admin.register(Server)
class ServerAdmin(ImportExportModelAdmin):
    pass

@admin.register(Closet)
class ClosetAdmin(ImportExportModelAdmin):
    pass

@admin.register(ClosetObject)
class ClosetObjectAdmin(ImportExportModelAdmin):
    pass

@admin.register(ClosetObjectType)
class ClosetObjectTypeAdmin(ImportExportModelAdmin):
    pass

@admin.register(FiberRun)
class FiberRunAdmin(ImportExportModelAdmin):
    pass
