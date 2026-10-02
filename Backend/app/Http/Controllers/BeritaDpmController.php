<?php

namespace App\Http\Controllers;

use App\Models\BeritaDpm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; // <-- Ditambahkan untuk fitur Slug

// Tambahan untuk kompresi gambar otomatis
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class BeritaDpmController extends Controller
{
    public function index()
    {
        $beritadpm = BeritaDpm::All();

        if ($beritadpm->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $beritadpm,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'isi_berita' => 'required|string|max:20000',
            'deskripsi_foto' => 'required|string|max:2000',
            'foto_berita' => 'required|image|mimes:jpeg,png,jpg,JPG|max:5120', // Batas upload diperbesar ke 5MB
            'tanggal_terbit' => 'nullable|date',
        ]);

        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };

        // PROSES KOMPRESI GAMBAR
        $image = $request->file("foto_berita");
        $filename = Str::random(40) . '.jpg'; // Paksa ekstensi jadi .jpg agar seragam dan aman

        $manager = new ImageManager(new Driver());
        $img = $manager->read($image);
        $img->scaleDown(width: 1000); // Maksimal lebar 1000px
        $encoded = $img->toJpeg(60); // Kualitas 60% agar file sangat kecil (di bawah 100KB)

        Storage::disk('public')->put('fotoBerita/' . $filename, $encoded->toString());

        $beritadpm = BeritaDpm::create([
            "judul" => $request->judul,
            "slug" => Str::slug($request->judul), // <-- Otomatis buat slug dari judul
            "isi_berita" => $request->isi_berita,
            "deskripsi_foto" => $request->deskripsi_foto,
            "foto_berita" => $filename,
            "tanggal_terbit" => $request->tanggal_terbit,
        ]);

        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $beritadpm
        ],200);
    }

    public function show(string $identifier)
    {
        // Ubah pencarian: Coba cari berdasarkan ID dulu, kalau tidak ada cari berdasarkan Slug
        $beritadpm = BeritaDpm::where('id', $identifier)
                              ->orWhere('slug', $identifier)
                              ->first();

        if(!$beritadpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $beritadpm
        ]);
    }

    public function update(Request $request, string $id)
    {
        $beritadpm = BeritaDpm::find($id);
        if(!$beritadpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'isi_berita' => 'required|string|max:20000',
            'deskripsi_foto' => 'required|string|max:2000',
            'foto_berita' => 'nullable|image|mimes:jpeg,png,jpg,JPG|max:5120', // Batas upload diperbesar ke 5MB
            'tanggal_terbit' => 'nullable|date',
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }

        $data = [
            "judul" => $request->judul,
            "slug" => Str::slug($request->judul), // <-- Update slug kalau judul berubah
            "isi_berita" => $request->isi_berita,
            "deskripsi_foto" => $request->deskripsi_foto,
            "tanggal_terbit" => $request->tanggal_terbit,
        ];

        if ($request->foto_berita){
            $image = $request->file('foto_berita');

            // Hapus foto lama jika ada
            if($beritadpm->foto_berita){
                Storage::disk('public')->delete('fotoBerita/'.$beritadpm->foto_berita);
            }

            // PROSES KOMPRESI GAMBAR BARU
            $filename = Str::random(40) . '.jpg';

            $manager = new ImageManager(new Driver());
            $img = $manager->read($image);
            $img->scaleDown(width: 1000);
            $encoded = $img->toJpeg(60);

            Storage::disk('public')->put('fotoBerita/' . $filename, $encoded->toString());

            $data['foto_berita'] = $filename;
        }

        $beritadpm->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $beritadpm
        ], 200);
    }

    public function destroy(string $id)
    {
        $beritadpm = BeritaDpm::find($id);
        if (!$beritadpm){
            return response()->json([
                "success" => true,
                "messege" => "resourse not found",
            ]);
        }
        if ($beritadpm->foto_berita){
            Storage::disk('public')->delete('fotoBerita/'.$beritadpm->foto_berita);
        }

        $beritadpm->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }

    // ========================================================
    // METHOD KHUSUS UNTUK WHATSAPP SHARE & OPEN GRAPH
    // ========================================================
    public function share($slug)
    {
        // Cari berita berdasarkan slug
        $berita = BeritaDpm::where('slug', $slug)->firstOrFail();

        // Panggil file view blade bernama "share_berita.blade.php"
        return view('share_berita', compact('berita'));
    }
}
