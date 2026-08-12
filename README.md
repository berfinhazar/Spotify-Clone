# 🎵 Spotify Benzeri Müzik Uygulaması

Django REST Framework (backend) + React (frontend) ile geliştirilmiş bir müzik streaming uygulaması.

## Özellikler
- Kullanıcı kayıt/giriş sistemi (JWT tabanlı authentication)
- Şarkı, albüm, sanatçı listeleme
- Arama fonksiyonu
- Çalma listesi (playlist) oluşturma / şarkı ekleme-çıkarma
- Müzik çalar: oynat/duraklat, ses seviyesi, ilerleme çubuğu, sıradaki/önceki şarkı
- Beğenilen şarkılar (favoriler)
- Responsive tasarım (Tailwind CSS)

## Teknolojiler
- **Backend:** Django 6, Django REST Framework, Simple JWT, django-cors-headers, SQLite
- **Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS 4

---

## Kurulum ve Çalıştırma

### Yöntem 1: Docker ile (önerilen)

Proje kök dizininde:

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Admin panel: http://localhost:8000/admin (admin / admin12345)

### Yöntem 2: Manuel (Docker'sız)

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data    # örnek veri ekler (opsiyonel)
python manage.py runserver
```

**Frontend (ayrı bir terminalde):**
```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:3000 adresinde açılır ve backend'e http://localhost:8000/api üzerinden bağlanır.

---

## Proje Yapısı

```
Spotify-Clone/
│
├── backend/
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── core/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── music/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_data.py
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── assets/
│   │   │   └── hero.png
│   │   │
│   │   ├── components/
│   │   │   ├── AddToPlaylistMenu.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PlayerBar.jsx
│   │   │   └── SongRow.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── PlayerContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Playlists.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Search.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## API Uç Noktaları (Endpoints)

| Method | URL | Açıklama |
|---|---|---|
| POST | `/api/auth/register/` | Kayıt ol |
| POST | `/api/auth/login/` | Giriş yap (access + refresh token döner) |
| POST | `/api/auth/login/refresh/` | Access token'ı yenile |
| GET | `/api/auth/me/` | Giriş yapmış kullanıcı bilgisi |
| GET | `/api/artists/` | Sanatçıları listele |
| GET | `/api/albums/` | Albümleri listele |
| GET | `/api/songs/?search=xyz` | Şarkı listele / ara |
| POST | `/api/songs/{id}/toggle_favorite/` | Favorilere ekle/çıkar |
| GET/POST | `/api/playlists/` | Çalma listelerini listele / oluştur |
| POST | `/api/playlists/{id}/add_song/` | Playliste şarkı ekle (body: `{"song_id": 3}`) |
| POST | `/api/playlists/{id}/remove_song/` | Playlistten şarkı çıkar |
| GET | `/api/favorites/` | Favori şarkıları listele |

## Gerçek Müzik Dosyaları Ekleme

Seed komutu (`seed_data`) demo amaçlı boş placeholder mp3 dosyaları oluşturur (player arayüzünü
test etmek için). Gerçek ses dosyaları eklemek için:

1. `/admin` paneline gir (admin / admin12345)
2. Music > Songs bölümünden şarkıları düzenle, "Audio file" alanına gerçek bir .mp3 dosyası yükle
3. Ya da kendi seed script'ini yazıp gerçek dosya yollarını kullan

## Notlar

- `SECRET_KEY` ve `DEBUG=True` şu an geliştirme ortamı için ayarlanmış durumda; production'a
  almadan önce `.env` dosyası ile güvenli hale getirilmeli.
- Veritabanı SQLite olarak ayarlandı (hızlı kurulum için). PostgreSQL'e geçmek istersen
  `core/settings.py` içindeki `DATABASES` bölümünü güncellemen yeterli.
