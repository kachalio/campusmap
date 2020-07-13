from django.db import models
from django.forms import ModelForm
from django.forms.models import model_to_dict

# Create your models here.


class Instance(models.TextChoices):
    DEV = "DEV"
    QAS = "QAS"
    PRD = "PRD"


class Status(models.TextChoices):
    ALIVE = "Alive"
    DECOMMISSIONED = "Decommissioned"


class FormFactor(models.TextChoices):
    AZUREVM = "Azure VM"
    BAREMETAL = "Bare Metal"
    VM = "VM"


class ManagedBy(models.TextChoices):
    TSV = "TSV"
    DXC = "DXC"
    BASIS = "BASIS"


class User(models.Model):

    # fields
    display_name = models.CharField(max_length=200)
    email = models.EmailField()


class OperatingSystem(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Site(models.Model):
	"""
	Description: Model Description
	"""
	name		  = models.CharField(max_length=30)
	streetAddress = models.CharField(max_length=100)
	description   = models.CharField(max_length=50)

	def __str__(self):
		return self.name

	class Meta:
		pass

class Server(models.Model):
    # foreign key
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True, related_name="owner")
    host = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)

    # fields
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    operating_system = OperatingSystem.name
    instance = models.CharField(choices=Instance.choices, max_length=100)
    status = models.CharField(choices=Status.choices, max_length=100)
    form_factor = models.CharField(choices=FormFactor.choices, max_length=100)
    managed_by = models.CharField(choices=ManagedBy.choices, max_length=100)
    internal_address = models.CharField(max_length = 15)
    public_address = models.CharField(max_length = 15, blank=True)
    dmz = models.BooleanField()

    def __str__(self):
        return self.name


class Closet(models.Model):
	"""
	Description: Model Description
	"""
	name	  = models.CharField(max_length=30)
	latitude  = models.DecimalField(null=True, blank=True, decimal_places=15, max_digits=18)
	longitude = models.DecimalField(null=True, blank=True, decimal_places=15, max_digits=18)
	site	  = models.ForeignKey(Site, on_delete=models.CASCADE)
	
	def __str__(self):
		return self.site.name + ": " + self.name
	
	class Meta:
		pass

class FiberRun(models.Model):
	"""
	Description: Model Description
	"""
	name    = models.CharField(max_length=30, null=True, blank = True)
	start_closet	= models.ForeignKey(Closet, on_delete=models.CASCADE, null=True, blank = True, related_name="fiber_run_start")
	end_closet	    = models.ForeignKey(Closet, on_delete=models.CASCADE, null=True, blank = True)

	class Meta:
		pass

class FiberLinePoint(models.Model):
	latitude      = models.DecimalField(null=True, blank=True, decimal_places=15, max_digits=18)
	longitude     = models.DecimalField(null=True, blank=True, decimal_places=15, max_digits=18)
	rank		  = models.IntegerField(null=True, blank=True)
	fiber_run	  = models.ForeignKey(FiberRun, on_delete=models.CASCADE, null=True, blank = True)

	class Meta:
		pass

class ClosetObjectType(models.Model):
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=150)

class ClosetObject(models.Model):
	"""
	Description: Model Description
	"""
	hostname   = models.CharField(max_length=30)
	ip_address = models.CharField(max_length=15, blank=True, null=True)
	description = models.CharField(max_length=150, blank=True, null=True)
	model	   = models.CharField(max_length=30)
	# objectType = models.CharField(max_length=30, blank=True, null=True)
	closet     = models.ForeignKey(Closet, on_delete=models.CASCADE)
	closetObjectType = models.ForeignKey(ClosetObjectType, on_delete=models.CASCADE)

	def __str__(self):
		return "%s - %s" % (self.closet.name, self.closetObjectType.name)
	
	class Meta:
		pass

class ClosetObjectField(models.Model):
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=150)
	closetObjectType = models.ForeignKey(ClosetObjectType, on_delete=models.CASCADE)

class ClosetObjectFieldAnswer(models.Model):
	answer = models.CharField(max_length=100)
	closetObject = models.ForeignKey(ClosetObject, on_delete=models.CASCADE)
	closetObjectField = models.ForeignKey(ClosetObjectField, on_delete=models.CASCADE)


# class Switch(ClosetObject):
# 	"""docstring for Switch"""
# 	type = "switch"

# 	class Meta:
# 		pass


# class UPS(ClosetObject):
# 	"""docstring for UPS"""

# 	type = "ups"

# 	class Meta:
# 		pass

# class Server(ClosetObject):
# 	"""docstring for Server"""

# 	type = "server"

# 	class Meta:
# 		pass
