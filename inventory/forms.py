from django.forms import ModelForm
from .models import Site, Server, Closet, FiberRun, ClosetObject, ClosetObjectType, ClosetObjectField

class SiteForm(ModelForm):
	class Meta:
		model = Site
		exclude = []

class ServerForm(ModelForm):
	class Meta:
		model = Server
		exclude = []

class ClosetForm(ModelForm):
	class Meta:
		model = Closet
		exclude = []

class FiberRunForm(ModelForm):
	class Meta:
		model = FiberRun
		exclude = []

class ClosetObjectForm(ModelForm):
	class Meta:
		model = ClosetObject
		exclude = ['closet']

class ClosetObjectTypeForm(ModelForm):
	class Meta:
		model = ClosetObjectType
		exclude = []

class ClosetObjectFieldForm(ModelForm):
	class Meta:
		model = ClosetObjectField
		exclude = []