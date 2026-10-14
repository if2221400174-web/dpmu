@php
    $gambar = $berita->foto_berita
        ? secure_url('storage/fotoBerita/' . $berita->foto_berita)
        : 'https://dpmunuja.id/assets/logo-DPM-Unuja-AtyMC0db.png';
    $deskripsi = \Illuminate\Support\Str::limit(trim(strip_tags($berita->isi_berita)), 160);
    $pageUrl = 'https://dpmunuja.id/informasi/' . ($berita->slug ?: $berita->id);
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $berita->judul }} | DPM UNUJA</title>
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="DPM UNUJA">
    <meta property="og:title" content="{{ $berita->judul }}">
    <meta property="og:description" content="{{ $deskripsi }}">
    <meta property="og:url" content="{{ $pageUrl }}">
    <meta property="og:image" content="{{ $gambar }}">
    <meta property="og:image:secure_url" content="{{ $gambar }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $berita->judul }}">
    <meta name="twitter:description" content="{{ $deskripsi }}">
    <meta name="twitter:image" content="{{ $gambar }}">
    <meta http-equiv="refresh" content="0; url={{ $pageUrl }}">
</head>
<body>
    <p>Mengalihkan... <a href="{{ $pageUrl }}">Klik di sini</a></p>
    <script>window.location.href = "{{ $pageUrl }}";</script>
</body>
</html>
