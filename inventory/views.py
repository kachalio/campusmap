
from django.shortcuts import render, reverse, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic import ListView, DetailView
from inventory.models import *
from inventory.forms import *




# Create your views here.

def home(request):
	sites_count = Site.objects.count()
	servers_count = Server.objects.count()
	return render(request, 'home.html', {'sites_count':sites_count, 'servers_count':servers_count})

### Site Functions ###
class SiteList(ListView):
	model = Site
	template_name = "site_list.html"
	context_object_name = "site_list"
	ordering = ['name']
	# paginate_by=10


class SiteDetails(DetailView):
	model = Site
	template_name = "site_details.html"
	context_object_name = "site_details"

def addSite(request):
	# if this is a POST request we need to process the form data
	if request.method == 'POST':
		# create a form instance and populate it with data from the request:
		form = SiteForm(request.POST)
		# check whether it's valid:
		if form.is_valid():
			form.save()
			# process the data in form.cleaned_data as required
			# ...
			# redirect to a new URL:
			return HttpResponseRedirect(reverse('add_site'))

	# if a GET (or any other method) we'll create a blank form
	else:
		form = SiteForm()

	return render(request, 'site_add.html', {'form': form})


def editSite(request, pk=None):
	# if this is a POST request we need to process the form data
	site = get_object_or_404(Site, pk=pk)
	if request.method == 'POST':
		# create a form instance and populate it with data from the request:
		form = SiteForm(request.POST, instance=site)
		# check whether it's valid:
		if form.is_valid():
			form.save()
			# process the data in form.cleaned_data as required
			# ...
			# redirect to a new URL:
			return HttpResponseRedirect(reverse('site_details', kwargs={'pk': pk}))

	# if a GET (or any other method) we'll create a blank form
	else:
		form = SiteForm(instance=site)

	return render(request, 'site_edit.html', {'form': form, 'site': site})


def deleteSite(request, pk=None):
	# if this is a POST request we need to process the form data
	site = get_object_or_404(Site, pk=pk)
	if request.method == 'POST':
		# create a form instance and populate it with data from the request:
		form = SiteForm(request.POST, instance=site)
		# check whether it's valid:
		if form.is_valid():
			site.delete()
			return HttpResponseRedirect(reverse('sites'))

	# if a GET (or any other method) we'll create a blank form
	else:
		form = SiteForm(instance=site)

	return render(request, 'site_delete.html', {'form': form, 'site': site})


### Server functions ###

class ServerDetails(DetailView):
	model = Server
	template_name = "server_details.html"
	context_object_name = "server_details"

class ServerList(ListView):
	model = Server
	template_name = "server_list.html"
	context_object_name = "server_list"

def addServer(request, pk=None):
	# if this is a POST request we need to process the form data
	if request.method == 'POST':
		# create a form instance and populate it with data from the request:
		form = ServerForm(request.POST)
		# check whether it's valid:
		if form.is_valid():
			form.save()
			# process the data in form.cleaned_data as required
			# ...
			# redirect to a new URL:
			return HttpResponseRedirect(reverse('add_server'))

	# if a GET (or any other method) we'll create a blank form
	else:
		form = ServerForm(initial={'site': pk})

	return render(request, 'server_add.html', {'form': form})

### Closet Functions ###
class ClosetDetails(DetailView):
	model = Closet
	template_name = "closet_details.html"
	context_object_name = "closet_details"

class ClosetList(ListView):
	model = Closet
	template_name = "closet_list.html"
	context_object_name = "closet_list"

def addCloset(request, pk):
	# if this is a POST request we need to process the form data
	site = get_object_or_404(Site, pk=pk)
	site_address = site.streetAddress.replace(" ", "+")

	if request.method == 'POST':
		# create a form instance and populate it with data from the request:
		form = ClosetForm(request.POST)
		# check whether it's valid:
		if form.is_valid():
			form.save()
			# process the data in form.cleaned_data as required
			# ...
			# redirect to a new URL:
			return redirect(reverse('site_details', kwargs={'pk':pk}))

	# if a GET (or any other method) we'll create a blank form
	else:
		form = ClosetForm(initial={'site':pk})

	return render(request, 'closet_add.html', {'form': form, 'site_id':pk, 'site_address':site_address})

def addFiberRun(request, pk):
	# if this is a POST request we need to process the form data
	closet = get_object_or_404(Closet, pk=pk)
	closet_gps = {'latitude':closet.latitude, 'longitude':closet.longitude}
	if request.method == 'POST':
		# create a form instance and populate it with data from the request:
		form = FiberRunForm(request.POST)
		# check whether it's valid:
		if form.is_valid():
			form.save()
			# process the data in form.cleaned_data as required
			# ...
			# redirect to a new URL:
			return redirect(reverse('closet_details', kwargs={'pk':pk}))

	# if a GET (or any other method) we'll create a blank form
	else:
		form = FiberRunForm(initial={'start_closet':pk})

	return render(request, 'fiber_run_add.html', {'form':form, 'closet_id':pk, 'closet_gps':closet_gps})

def addClosetObject(request, pk):
	if request.method == 'POST':
		closet = get_object_or_404(Closet, pk=pk)
		closetObject = ClosetObject(closet=closet)
		form = ClosetObjectForm(request.POST, instance=closetObject)
		if form.is_valid():
			form.save()
			return redirect(reverse('closet_details', kwargs={'pk':pk}))
	else:
		form = ClosetObjectForm()
		return render(request, 'closetobject_add.html', {'form': form, 'closet_id': pk})
