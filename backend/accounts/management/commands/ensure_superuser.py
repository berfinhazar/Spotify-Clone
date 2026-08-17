import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Environment variable'larda tanımlıysa ve henüz yoksa bir superuser oluşturur."

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not username or not password:
            self.stdout.write('DJANGO_SUPERUSER_USERNAME / PASSWORD tanımlı değil, atlanıyor.')
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(f'Superuser "{username}" zaten var, atlanıyor.')
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" oluşturuldu.'))