from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ArtistViewSet, AlbumViewSet, SongViewSet, PlaylistViewSet, FavoriteSongViewSet

router = DefaultRouter()
router.register('artists', ArtistViewSet, basename='artist')
router.register('albums', AlbumViewSet, basename='album')
router.register('songs', SongViewSet, basename='song')
router.register('playlists', PlaylistViewSet, basename='playlist')
router.register('favorites', FavoriteSongViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
]
