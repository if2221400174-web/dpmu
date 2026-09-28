<?php

namespace App\Http\Controllers;

use App\Models\Keputusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class KeputusanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $keputusan = Keputusan::All();

        if ($keputusan->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $keputusan,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //1 validator
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'abstract' => 'required|string|max:54255',
            'status' => 'required|string|max:255',
            'tanggal_ditetapkan' => 'required|date',
            'file' => 'required|mimes:pdf,doc,docx,xls,xlsx|max:2048'
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
        $file ->store('fileHukum', 'public');

        //4. insert data
        $keputusan = Keputusan::create([
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
            "data" => $keputusan
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $keputusan = Keputusan::find($id);

        if(!$keputusan){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $keputusan
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //1, cari data
        $keputusan = Keputusan::find($id);
        if(!$keputusan){
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
            'file' => 'nullable|mimes:pdf,doc,docx,xls,xlsx|max:2048'
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

        ];
        //4 handle file(upload atau delete)
        if ($request->file('file')) {
        $file = $request->file('file');
        $file->store('fileHukum', 'public');

        if ($keputusan->file) {
            Storage::disk('public')->delete('fileHukum/' . $keputusan->file);
        }
        $data['file'] = $file->hashName();
    }

        //5, update data
        $keputusan->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $keputusan
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $keputusan = Keputusan::find($id);
        if (!$keputusan){
            return response()->json([
                "success" => true,
                "messege" => "resourse not found",
            ]);
        }
        if ($keputusan ->file){
            Storage::disk('public')->delete('fileHukum/'.$keputusan->file);
        }

        $keputusan ->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }
}
