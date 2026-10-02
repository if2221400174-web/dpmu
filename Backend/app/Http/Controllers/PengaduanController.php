<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; // <-- Ditambahkan untuk membuat nama file acak

// Tambahan untuk kompresi gambar otomatis
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PengaduanController extends Controller
{
    public function index()
    {
        $pengaduan = Pengaduan::All();

        if ($pengaduan->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $pengaduan,
        ], 200);
    }

    public function store(Request $request)
    {
        //1 validator
        $validator = Validator::make($request->all(),[
            'prodi' => 'required|string|max:255',
            'fakultas' => 'required|string|max:255',
            'deskripsi_masalah' => 'required|string|max:2000',
            'foto_bukti' => 'required|image|mimes:jpeg,png,jpg|max:5120', // Bebas upload s.d 5MB
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };

        //3. upload & kompres otomatis
        $image = $request->file("foto_bukti");
        $filename = Str::random(40) . '.jpg'; // Paksa ekstensi .jpg

        $manager = new ImageManager(new Driver());
        $img = $manager->read($image);
        $img->scaleDown(width: 1000); // Maksimal lebar 1000px agar ringan
        $encoded = $img->toJpeg(60); // Kualitas 60% agar file sangat kecil

        Storage::disk('public')->put('buktiPengaduan/' . $filename, $encoded->toString());

        //4. insert data
        $pengaduan = Pengaduan::create([
            "prodi" => $request->prodi,
            "fakultas" => $request->fakultas,
            "deskripsi_masalah" => $request->deskripsi_masalah,
            "foto_bukti" => $filename,
        ]);

        //5. response
        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $pengaduan
        ],200);
    }

    public function show(string $id){
        $pengaduan = Pengaduan::find($id);

        if(!$pengaduan){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $pengaduan
        ]);
    }

    public function update(Request $request, string $id)
    {
        //1, cari data
        $pengaduan = Pengaduan::find($id);
        if(!$pengaduan){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        //2. validator
        $validator = Validator::make($request->all(),[
            'prodi' => 'required|string|max:255',
            'fakultas' => 'required|string|max:255',
            'deskripsi_masalah' => 'required|string|max:2000',
            'foto_bukti' => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // Bebas upload s.d 5MB
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }

        //3 siapkan data yang mau diupdate
        $data = [
            "prodi" => $request->prodi,
            "fakultas" => $request->fakultas,
            "deskripsi_masalah" => $request->deskripsi_masalah,
        ];

        //4 handle image(uapload atau delete)
        if ($request->foto_bukti){
            $image = $request->file('foto_bukti');

            // PERBAIKAN BUG: Hapus foto lama di folder 'buktiPengaduan' (sebelumnya salah nama folder)
            if($pengaduan->foto_bukti){
                Storage::disk('public')->delete('buktiPengaduan/'.$pengaduan->foto_bukti);
            }

            // Kompresi foto baru
            $filename = Str::random(40) . '.jpg';

            $manager = new ImageManager(new Driver());
            $img = $manager->read($image);
            $img->scaleDown(width: 1000);
            $encoded = $img->toJpeg(60);

            Storage::disk('public')->put('buktiPengaduan/' . $filename, $encoded->toString());

            $data['foto_bukti'] = $filename;
        }

        //5, update data
        $pengaduan->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $pengaduan
        ], 200);
    }

    public function destroy(string $id)
    {
        $pengaduan = Pengaduan::find($id);
        if (!$pengaduan){
            return response()->json([
                "success" => true,
                "messege" => "resourse not found",
            ]);
        }

        // PERBAIKAN BUG: Hapus foto di folder yang benar
        if ($pengaduan->foto_bukti){
            Storage::disk('public')->delete('buktiPengaduan/'.$pengaduan->foto_bukti);
        }

        $pengaduan->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }
}
