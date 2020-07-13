"""campusmap URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from inventory import views as inventory_views
from map import views as map_views

urlpatterns = [
	# I don't have these alphabetical but by hierarchy.  not sure which one is more correct
	# But i wrote it, so this is how it goes
	path('admin/', admin.site.urls, name='admin'),
	path('', inventory_views.home, name='home'),
	# Sites
	re_path(r'^sites/$', inventory_views.SiteList.as_view(), name='sites'),
	re_path(r'^sites/add$', inventory_views.addSite, name='add_site'),
	re_path(r'^sites/edit/(?P<pk>\d+)$', inventory_views.editSite, name='site_edit'),
    re_path(r'^sites/delete/(?P<pk>\d+)$', inventory_views.deleteSite, name='site_delete'),
	re_path(r'^sites/(?P<pk>\d+)/add_closet$', inventory_views.addCloset, name='add_closet'),
	re_path(r'^sites/(?P<pk>\d+)$', inventory_views.SiteDetails.as_view(), name='site_details'),
	# Servers
	re_path(r'^servers/$', inventory_views.ServerList.as_view(), name='servers'),
	re_path(r'^servers/add$', inventory_views.addServer, name='add_server'),
	re_path(r'^servers/add/(?P<pk>\d+)$', inventory_views.addServer, name='add_server'),
    re_path(r'^servers/(?P<pk>\d+)$',inventory_views.ServerDetails.as_view(), name='server_details'),
	# Closets
	re_path(r'^closets/$', inventory_views.ClosetList.as_view(), name='closets'),
	re_path(r'^closets/add$', inventory_views.addCloset, name='add_closet'),
	re_path(r'^closets/(?P<pk>\d+)$', inventory_views.ClosetDetails.as_view(), name='closet_details'),
	re_path(r'^closets/(?P<pk>\d+)/add_fiber_run$', inventory_views.addFiberRun, name='add_fiber_run'),
	re_path(r'^closets/(?P<pk>\d+)/add_closet_object$', inventory_views.addClosetObject, name='add_closet_object'),
	# Map shit
	#re_path(r'^map/$', map_views.mapSite, name='map_site'),
	re_path(r'^map/$', map_views.mapSiteList, name='map_site_list'),
	# re_path(r'^map/(?P<pk>\d+)$', map_views.mapSite, name='map_site'),
	re_path(r'^ajax/get_site_data/$', map_views.getSiteData, name='get_site_data'),
	re_path(r'^ajax/get_site_list/$', map_views.getSiteList, name='get_site_list'),
]
