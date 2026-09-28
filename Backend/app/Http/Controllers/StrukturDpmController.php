<?php

namespace App\Http\Controllers;

use App\Models\StrukturDpm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };
        //3. upload image
        $image = $request->file("foto");
        $image ->store('fotoStruktur', 'public');

        //4. insert data
        $strukturdpm = StrukturDpm::create([
            "nama" => $request->nama,
            "jabatan" => $request->jabatan,
            "foto" => $image->hashName(),
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
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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
            $image->store('fotoStruktur', 'public');


            if($strukturdpm->foto){
                Storage::disk('public')->delete('fotoStruktur/'.$strukturdpm->foto);
            }
            $data['foto'] =$image->hashName();
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
