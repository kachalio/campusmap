from django.conf import settings
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.utils.safestring import mark_safe
from django.utils.html import escapejs
from inventory.models import *
import json

# Create your views here.

# works with map_js_populate (if renamed back to map.html)
# def map(request):
# 	# site, closets
# 	# click on closet and list details in pop up
# 	sites = Site.objects.all()
# 	print(sites)
# 	return render(request, 'map.html', {'sites' : sites})

def mapSiteSelect(request):
	sites = Site.objects.all()
	return render(request, 'map_select.html', {'sites' : sites})

def mapSite(request):
	# site, closets
	# click on closet and list details in pop up

	sites = Site.objects.all()
	print(sites)

	return render(request, 'map_site_list.html', {'sites': sites, 'api_key':settings.GOOGLE_MAPS_API_KEY})

def mapSiteList(request):
	# site, closets
	# click on closet and list details in pop up

	sites = Site.objects.all()

	return render(request, 'map_site_list.html', {'sites': sites, 'api_key':settings.GOOGLE_MAPS_API_KEY})


def getSiteData(request):
	pk = request.GET.get('pk', None)
	site = get_object_or_404(Site, id=pk)

	closet_query = site.closet_set.all()
	closets = []
	fiber_runs = []
	for closet in closet_query:
		closets.append(model_to_dict(closet))
	
		fiber_run_query = closet.fiber_run_start.all()

		for fiber_run in fiber_run_query:
			# fiber_runs.append(model_to_dict(fiber_run))
			fiber_run_dict = model_to_dict(fiber_run)

			fiber_run_dict["start_closet"] = {'lat' : fiber_run.start_closet.latitude,'lng': fiber_run.start_closet.longitude}
			fiber_run_dict["end_closet"]   = {'lat' : fiber_run.end_closet.latitude,'lng': fiber_run.end_closet.longitude}

			print(fiber_run_dict)
			fiber_runs.append(fiber_run_dict)

	data = {'site': model_to_dict(site), 'closets' : closets, 'fiber_runs' :  fiber_runs}

	return JsonResponse(data, safe=False)

def getSiteList(request):
	site_query = Site.objects.all()
	print(site_query.count())
	sites = []
	for site in site_query:
		sites.append(model_to_dict(site))


	data = {'sites': sites}

	return JsonResponse(data, safe=False)
