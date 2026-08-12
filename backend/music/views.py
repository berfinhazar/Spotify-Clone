from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Artist, Album, Song, Playlist, FavoriteSong
from .serializers import (
    ArtistSerializer, AlbumSerializer, SongSerializer,
    PlaylistSerializer, FavoriteSongSerializer,
)


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'artist__name']


class SongViewSet(viewsets.ModelViewSet):
    """
    /api/songs/?search=xyz  -> başlığa, albüme veya sanatçı adına göre arama yapar
    """
    queryset = Song.objects.select_related('album', 'artist').all()
    serializer_class = SongSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'album__title', 'artist__name']

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        """POST /api/songs/{id}/toggle_favorite/  -> favorilere ekler/çıkarır"""
        song = self.get_object()
        favorite, created = FavoriteSong.objects.get_or_create(user=request.user, song=song)
        if not created:
            favorite.delete()
            return Response({'is_favorited': False})
        return Response({'is_favorited': True})


class PlaylistViewSet(viewsets.ModelViewSet):
    """Kullanıcı sadece kendi playlistlerini görür ve yönetir."""
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def add_song(self, request, pk=None):
        """POST /api/playlists/{id}/add_song/  body: {"song_id": 3}"""
        playlist = self.get_object()
        song_id = request.data.get('song_id')
        song = Song.objects.get(pk=song_id)
        playlist.songs.add(song)
        return Response(PlaylistSerializer(playlist).data)

    @action(detail=True, methods=['post'])
    def remove_song(self, request, pk=None):
        """POST /api/playlists/{id}/remove_song/  body: {"song_id": 3}"""
        playlist = self.get_object()
        song_id = request.data.get('song_id')
        song = Song.objects.get(pk=song_id)
        playlist.songs.remove(song)
        return Response(PlaylistSerializer(playlist).data)


class FavoriteSongViewSet(viewsets.ReadOnlyModelViewSet):
    """Kullanıcının favori şarkı listesi (sadece görüntüleme, ekleme/çıkarma SongViewSet.toggle_favorite ile yapılıyor)."""
    serializer_class = FavoriteSongSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteSong.objects.filter(user=self.request.user)
