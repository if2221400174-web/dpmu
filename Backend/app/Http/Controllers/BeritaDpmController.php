<?php

namespace App\Http\Controllers;

use App\Models\BeritaDpm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BeritaDpmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        //1 validator
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'isi_berita' => 'required|string|max:20000',
            'deskripsi_foto' => 'required|string|max:2000',
            'foto_berita' => 'required|image|mimes:jpeg,png,JPG|max:2048',
            'tanggal_terbit' => 'nullable|date',
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };
        //3. upload image
        $image = $request->file("foto_berita");
        $image ->store('fotoBerita', 'public');

        //4. insert data
        $beritadpm = BeritaDpm::create([
            "judul" => $request->judul,
            "isi_berita" => $request->isi_berita,
            "deskripsi_foto" => $request->deskripsi_foto,
            "foto_berita" => $image->hashName(),
            "tanggal_terbit" => $request->tanggal_terbit,
        ]);

        //5. response
        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $beritadpm
        ],200);
    }

    public function show(string $id)
    {
        $beritadpm = BeritaDpm::find($id);

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
        //1, cari data
        $beritadpm = BeritaDpm::find($id);
        if(!$beritadpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }
        //2. validator
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'isi_berita' => 'required|string|max:20000',
            'deskripsi_foto' => 'required|string|max:2000',
            'foto_berita' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tanggal_terbit' => 'nullable|date',
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }
        //3 siapkan data yang mau diupdate
        $data = [
            "judul" => $request->judul,
            "isi_berita" => $request->isi_berita,
            "deskripsi_foto" => $request->deskripsi_foto,
            "tanggal_terbit" => $request->tanggal_terbit,
        ];
        //4 handle image(uapload atau delete)
        if ($request->foto_berita){
            $image = $request->file('foto_berita');
            $image->store('fotoBerita', 'public');


            if($beritadpm->foto_berita){
                Storage::disk('public')->delete('fotoBerita/'.$beritadpm->foto_berita);
            }
            $data['foto_berita'] =$image->hashName();
        }
        //5, update data
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
}
