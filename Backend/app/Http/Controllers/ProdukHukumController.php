<?php

namespace App\Http\Controllers;

use App\Models\ProdukHukum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use function Symfony\Component\String\s;

class ProdukHukumController extends Controller
{
    public function index()
    {
        $porhum = ProdukHukum::All();

        if ($porhum->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $porhum,
        ], 200);
    }

    public function store(Request $request)
    {
        //1 validator
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'abstract' => 'required|string|max:54255',
            'status' => 'required|string|max:255',
            'tanggal_ditetapkan' => 'required|date',
            'file' => 'required|mimes:pdf,doc,docx,xls,xlsx|max:20480'
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };

        //3. upload file
        $file = $request->file("file");
        $file->store('fileHukum', 'public');

        //4. insert data
        $porhum = ProdukHukum::create([
            "judul" => $request->judul,
            "abstract" => $request->abstract,
            "status" => $request->status,
            "tanggal_ditetapkan" => $request->tanggal_ditetapkan,
            "file" => $file->hashName(),
        ]);

        //5. response
        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $porhum
        ], 200);
    }

    public function show(string $id)
    {
        $porhum = ProdukHukum::find($id);

        if(!$porhum){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $porhum
        ]);
    }

    public function update(Request $request, string $id)
    {
        //1, cari data
        $porhum = ProdukHukum::find($id);
        if(!$porhum){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        //2. validator
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'abstract' => 'required|string|max:54255',
            'status' => 'required|string|max:255',
            'tanggal_ditetapkan' => 'required|date',
            'file' => 'nullable|mimes:pdf,doc,docx,xls,xlsx|max:20480'
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
            "abstract" => $request->abstract,
            "status" => $request->status,
            "tanggal_ditetapkan" => $request->tanggal_ditetapkan
        ];

        //4 handle file(upload atau delete)
        if ($request->file('file')) {
            $file = $request->file('file');
            $file->store('fileHukum', 'public');

            if ($porhum->file) {
                Storage::disk('public')->delete('fileHukum/' . $porhum->file);
            }
            $data['file'] = $file->hashName();
        }

        //5, update data
        $porhum->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $porhum
        ], 200);
    }

    public function destroy(string $id)
    {
        $porhum = ProdukHukum::find($id);
        if (!$porhum){
            return response()->json([
                "success" => false,
                "messege" => "resourse not found",
            ], 404);
        }

        if ($porhum->file){
            Storage::disk('public')->delete('fileHukum/'.$porhum->file);
        }

        $porhum->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ], 200);
    }

    // =========================================================================
    // FITUR BARU: DOWNLOAD FILE DENGAN NAMA JUDUL
    // =========================================================================
    public function downloadFile(string $id)
    {
        $porhum = ProdukHukum::find($id);

        // Cek apakah data dan file-nya ada
        if (!$porhum || !$porhum->file) {
            return response()->json([
                "success" => false,
                "messege" => "File not found"
            ], 404);
        }

        $path = 'fileHukum/' . $porhum->file;

        // Cek apakah file fisik benar-benar ada di storage server
        if (!Storage::disk('public')->exists($path)) {
            return response()->json([
                "success" => false,
                "messege" => "File missing on server"
            ], 404);
        }

        // 1. Ubah spasi dan karakter aneh pada judul menjadi garis bawah (underscore)
        // Contoh: "UU Pemilu 2026!" diubah menjadi "UU_Pemilu_2026_"
        $safeTitle = preg_replace('/[^a-zA-Z0-9]/', '_', $porhum->judul);

        // 2. Ambil ekstensi aslinya (misalnya: pdf atau docx)
        $extension = pathinfo($porhum->file, PATHINFO_EXTENSION);

        // 3. Gabungkan Judul Bersih dengan Ekstensinya
        $namaDownload = $safeTitle . '.' . $extension;

        // 4. Perintahkan server untuk mendownload dengan nama baru tersebut
        return Storage::disk('public')->download($path, $namaDownload);
    }
}
