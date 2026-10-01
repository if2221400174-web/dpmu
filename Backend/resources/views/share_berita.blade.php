<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <!-- Meta Tags Khusus agar dibaca oleh WhatsApp, FB, dll -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{{ $berita->judul }}" />
    <meta property="og:description" content="{{ Str::limit(strip_tags($berita->isi_berita), 120) }}" />
    <meta property="og:image" content="{{ asset('storage/fotoBerita/' . $berita->foto_berita) }}" />

    <title>{{ $berita->judul }}</title>
</head>
<body>
    <p>Mengalihkan ke halaman website...</p>

    <!-- SCRIPT AJAIB: Jika manusia yang mengklik link ini, langsung lempar ke web React kamu -->
    <script>
        // Ganti dpmunuja.id dengan domain aslimu jika ada perubahan
        window.location.href = "https://dpmunuja.id/informasi/" + "{{ $berita->slug }}";
    </script>
</body>
</html>
