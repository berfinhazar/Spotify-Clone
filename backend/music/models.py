from django.conf import settings
from django.db import models


class Artist(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='artists/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Album(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, related_name='albums', on_delete=models.CASCADE)
    cover_image = models.ImageField(upload_to='album_covers/', null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-release_date']

    def __str__(self):
        return f"{self.title} - {self.artist.name}"


class Song(models.Model):
    title = models.CharField(max_length=200)
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, related_name='songs', on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='songs/')
    duration_seconds = models.PositiveIntegerField(default=0)
    track_number = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['track_number']

    def __str__(self):
        return f"{self.title} - {self.artist.name}"


class Playlist(models.Model):
    """Kullanıcıların oluşturduğu çalma listeleri."""
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='playlists', on_delete=models.CASCADE
    )
    songs = models.ManyToManyField(Song, related_name='playlists', blank=True)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.owner.username})"


class FavoriteSong(models.Model):
    """Kullanıcının beğendiği (favorilediği) şarkılar."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='favorite_songs', on_delete=models.CASCADE
    )
    song = models.ForeignKey(Song, related_name='favorited_by', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'song')  # aynı şarkı bir kullanıcı tarafından 2 kere favorilenemez
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} <3 {self.song.title}"
