<?php

namespace App\Http\Controllers;

use App\Models\StrukturDpm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; // <-- Ditambahkan untuk nama file unik

// Tambahan untuk kompresi gambar otomatis
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class StrukturDpmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $strukturdpm = StrukturDpm::All();

        if ($strukturdpm->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $strukturdpm,
        ], 200);
    }


    public function store(Request $request)
    {
        //1 validator
        $validator = Validator::make($request->all(),[
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:2000',
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:5120', // Batas upload diperbesar s.d 5MB
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };

        //3. upload & kompres otomatis
        $image = $request->file("foto");
        $filename = Str::random(40) . '.jpg'; // Paksa ekstensi .jpg

        $manager = new ImageManager(new Driver());
        $img = $manager->read($image);
        $img->scaleDown(width: 800); // Maksimal lebar 800px (ideal untuk foto profil)
        $encoded = $img->toJpeg(60); // Kualitas 60%

        Storage::disk('public')->put('fotoStruktur/' . $filename, $encoded->toString());

        //4. insert data
        $strukturdpm = StrukturDpm::create([
            "nama" => $request->nama,
            "jabatan" => $request->jabatan,
            "foto" => $filename,
        ]);

        //5. response
        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $strukturdpm
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $strukturdpm = StrukturDpm::find($id);

        if(!$strukturdpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $strukturdpm
        ]);
    }

    public function update(Request $request, string $id)
    {
        //1, cari data
        $strukturdpm = StrukturDpm::find($id);
        if(!$strukturdpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        //2. validator
        $validator = Validator::make($request->all(),[
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:2000',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // Batas upload diperbesar s.d 5MB
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }

        //3 siapkan data yang mau diupdate
        $data = [
            "nama" => $request->nama,
            "jabatan" => $request->jabatan,
        ];

        //4 handle image(uapload atau delete)
        if ($request->foto){
            $image = $request->file('foto');

            // Hapus foto lama jika ada
            if($strukturdpm->foto){
                Storage::disk('public')->delete('fotoStruktur/'.$strukturdpm->foto);
            }

            // Kompresi foto baru
            $filename = Str::random(40) . '.jpg';

            $manager = new ImageManager(new Driver());
            $img = $manager->read($image);
            $img->scaleDown(width: 800);
            $encoded = $img->toJpeg(60);

            Storage::disk('public')->put('fotoStruktur/' . $filename, $encoded->toString());

            $data['foto'] = $filename;
        }

        //5, update data
        $strukturdpm->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $strukturdpm
        ], 200);
    }

    public function destroy(string $id)
    {
        $strukturdpm = StrukturDpm::find($id);
        if (!$strukturdpm){
            return response()->json([
                "success" => true,
                "messege" => "resourse not found",
            ]);
        }

        if ($strukturdpm->foto){
            Storage::disk('public')->delete('fotoStruktur/'.$strukturdpm->foto);
        }

        $strukturdpm->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }
}
