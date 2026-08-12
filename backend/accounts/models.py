from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Django'nun varsayılan User modelini genişletiyoruz.
    İleride profil fotoğrafı gibi ek alanlar eklemek istersen
    buraya kolayca ekleyebilirsin.
    """
    profile_image = models.ImageField(
        upload_to='profile_images/', null=True, blank=True
    )

    def __str__(self):
        return self.username
