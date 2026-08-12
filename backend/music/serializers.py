from rest_framework import serializers

from .models import Artist, Album, Song, Playlist, FavoriteSong


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'image', 'created_at']


class SongSerializer(serializers.ModelSerializer):
    artist_name = serializers.ReadOnlyField(source='artist.name')
    album_title = serializers.ReadOnlyField(source='album.title')
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = [
            'id', 'title', 'album', 'album_title', 'artist', 'artist_name',
            'audio_file', 'duration_seconds', 'track_number', 'is_favorited',
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return FavoriteSong.objects.filter(user=request.user, song=obj).exists()
        return False


class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.ReadOnlyField(source='artist.name')
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = [
            'id', 'title', 'artist', 'artist_name', 'cover_image',
            'release_date', 'songs',
        ]


class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    song_ids = serializers.PrimaryKeyRelatedField(
        queryset=Song.objects.all(), source='songs', many=True, write_only=True, required=False
    )
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Playlist
        fields = [
            'id', 'name', 'owner', 'owner_username', 'songs', 'song_ids',
            'is_public', 'created_at',
        ]
        read_only_fields = ['owner']


class FavoriteSongSerializer(serializers.ModelSerializer):
    song_detail = SongSerializer(source='song', read_only=True)

    class Meta:
        model = FavoriteSong
        fields = ['id', 'song', 'song_detail', 'added_at']
