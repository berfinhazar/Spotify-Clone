import { useEffect, useState } from 'react'
import api from '../api/axios'
import SongRow from '../components/SongRow'
import { usePlayer } from '../context/PlayerContext'

export default function Home() {
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  const { playSong } = usePlayer()

  useEffect(() => {
    Promise.all([
      api.get('/songs/'),
      api.get('/albums/'),
      api.get('/artists/'),
    ])
      .then(([songsRes, albumsRes, artistsRes]) => {
        setSongs(songsRes.data)
        setAlbums(albumsRes.data)
        setArtists(artistsRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="px-5 md:px-8 pt-24 md:pt-8">
        <div className="h-10 w-64 bg-white/[0.05] rounded-xl animate-pulse mb-8" />
        <div className="h-64 bg-white/[0.04] rounded-3xl animate-pulse" />
      </div>
    )
  }

  const featuredSongs = songs.slice(0, 4)
  const popularSongs = songs.slice(0, 8)

  return (
    <div className="px-5 md:px-8 pt-24 md:pt-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-zinc-500 mb-1">
            Tekrar hoş geldin 👋
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Bugün ne dinlemek istersin?
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition">
            ‹
          </button>

          <button className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition">
            ›
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] min-h-[300px] md:min-h-[330px] mb-10 bg-gradient-to-br from-[#34216d] via-[#17152d] to-[#101820] border border-white/[0.06]">

        <div className="absolute w-80 h-80 rounded-full bg-violet-500/20 blur-[90px] -top-32 -right-20" />

        <div className="absolute w-72 h-72 rounded-full bg-cyan-400/10 blur-[100px] bottom-[-180px] left-1/3" />

        <div className="relative z-10 p-7 md:p-10 max-w-2xl flex flex-col justify-center min-h-[300px]">

          <span className="inline-flex w-fit px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-violet-200 mb-5">
            ✦ Önerilen senin için
          </span>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
            Good music.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">
              Good mood.
            </span>
          </h2>

          <p className="text-zinc-400 mt-5 max-w-md text-sm md:text-base leading-relaxed">
            Ruh haline uygun müzikleri keşfet, favorilerini kaydet
            ve kendi listelerini oluştur.
          </p>

          {featuredSongs.length > 0 && (
            <button
              onClick={() => playSong(featuredSongs[0], songs)}
              className="mt-7 w-fit px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition shadow-xl"
            >
              ▶ Şimdi dinle
            </button>
          )}
        </div>

        {/* DECORATIVE MUSIC CARD */}
        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 rotate-6">

          <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-violet-500/80 to-cyan-400/70 p-[1px] shadow-2xl shadow-violet-900/50">

            <div className="w-full h-full rounded-3xl bg-[#15151b] flex flex-col items-center justify-center">

              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-5xl shadow-xl">
                ♫
              </div>

              <p className="mt-4 text-sm font-semibold">
                Your soundtrack
              </p>

              <p className="text-xs text-zinc-500">
                Just for you
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ALBUMS */}
      {albums.length > 0 && (
        <section className="mb-12">

          <SectionHeader
            title="Senin için seçtiklerimiz"
            subtitle="Son zamanlarda dinleyebileceğin albümler"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">

            {albums.slice(0, 6).map((album) => (
              <div
                key={album.id}
                className="music-card group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#18181d] mb-3">

                  {album.cover_image ? (
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-500/40 to-cyan-400/20 flex items-center justify-center text-5xl">
                      💿
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (album.songs?.length) {
                        playSong(album.songs[0], album.songs)
                      }
                    }}
                    className="play-button"
                  >
                    ▶
                  </button>
                </div>

                <p className="font-medium text-sm truncate">
                  {album.title}
                </p>

                <p className="text-xs text-zinc-500 truncate mt-1">
                  {album.artist_name}
                </p>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* ARTISTS */}
      {artists.length > 0 && (
        <section className="mb-12">

          <SectionHeader
            title="Popüler sanatçılar"
            subtitle="Dinlemeye değer isimler"
          />

          <div className="flex gap-5 overflow-x-auto pb-3 hide-scrollbar">

            {artists.slice(0, 8).map((artist) => (
              <div
                key={artist.id}
                className="artist-card group shrink-0 w-32 sm:w-36 text-center"
              >

                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-violet-500/30 to-cyan-400/20 mb-3">

                  {artist.image ? (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🎤
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                      ▶
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium truncate">
                  {artist.name}
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  Sanatçı
                </p>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* SONGS */}
      <section className="mb-12">

        <SectionHeader
          title="Trend olanlar"
          subtitle="Şu anda dinlenen şarkılar"
        />

        {popularSongs.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center text-zinc-500">
            Henüz şarkı eklenmemiş.
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
            {popularSongs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                songList={songs}
                index={index}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">
          {title}
        </h2>

        <p className="text-xs md:text-sm text-zinc-500 mt-1">
          {subtitle}
        </p>
      </div>

      <button className="text-xs text-zinc-500 hover:text-white transition">
        Tümünü gör →
      </button>
    </div>
  )
}