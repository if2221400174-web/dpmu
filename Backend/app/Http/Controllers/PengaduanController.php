<?php

namespace App\Http\Controllers;

use App\Models\Pengaduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'foto_bukti' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };
        //3. upload image
        $image = $request->file("foto_bukti");
        $image ->store('buktiPengaduan', 'public');

        //4. insert data
        $pengaduan = Pengaduan::create([
            "prodi" => $request->prodi,
            "fakultas" => $request->fakultas,
            "deskripsi_masalah" => $request->deskripsi_masalah,
            "foto_bukti" => $image->hashName(),
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
            'foto_bukti' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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
            $image->store('buktiPengaduan', 'public');


            if($pengaduan->foto_bukti){
                Storage::disk('public')->delete('pengaduans/'.$pengaduan->foto_bukti);
            }
            $data['foto_bukti'] =$image->hashName();
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
        if ($pengaduan ->foto_bukti){
            Storage::disk('public')->delete('pengaduans/'.$pengaduan->foto_bukti);
        }

        $pengaduan ->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }
}
