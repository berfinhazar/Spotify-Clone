from django.core.management.base import BaseCommand
from music.models import Artist, Album, Song
from django.core.files.base import ContentFile


class Command(BaseCommand):
    help = "Veritabanına örnek sanatçı, albüm ve şarkı verisi ekler (demo amaçlı)."

    def handle(self, *args, **options):
        if Artist.objects.exists():
            self.stdout.write(self.style.WARNING("Veritabanında zaten veri var, seed işlemi atlandı."))
            return

        # Küçük, sessiz bir dummy mp3 dosyası - gerçek ses dosyalarını admin panelinden
        # yükleyene kadar player'ın arayüzünü test edebilmek için placeholder.
        dummy_audio = ContentFile(b"", name="placeholder.mp3")

        artists_data = [
            {"name": "Nova Ritim", "bio": "Elektronik ve indie pop tarzında üreten bir sanatçı."},
            {"name": "Gece Yolcuları", "bio": "Akustik ve lo-fi tarzında bir müzik grubu."},
            {"name": "Deniz Feneri", "bio": "Türkçe pop-rock tarzında bir sanatçı."},
        ]

        for a_data in artists_data:
            artist = Artist.objects.create(**a_data)
            album = Album.objects.create(
                title=f"{artist.name} - İlk Albüm",
                artist=artist,
            )
            for i in range(1, 4):
                song = Song(
                    title=f"{artist.name} Şarkı {i}",
                    album=album,
                    artist=artist,
                    duration_seconds=180 + i * 15,
                    track_number=i,
                )
                song.audio_file.save(f"placeholder_{artist.id}_{i}.mp3", dummy_audio, save=True)

        self.stdout.write(self.style.SUCCESS("Örnek veri başarıyla eklendi: 3 sanatçı, 3 albüm, 9 şarkı."))
