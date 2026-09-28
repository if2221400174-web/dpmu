<?php

namespace App\Http\Controllers;

use App\Models\TentangDpm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TentangDpmController extends Controller
{
    public function index()
    {
        $tentangdpm = TentangDpm::All();

        if ($tentangdpm->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $tentangdpm,
        ], 200);
    }

    public function store(Request $request)
    {
         //1 validator
        $validator = Validator::make($request->all(),[
            'tujuan' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'fungsi' => 'required|string|max:2000',
            'visi' => 'required|string|max:2000',
            'misi' => 'required|string|max:2000',
        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };
        //4. insert data
        $tentangdpm = TentangDpm::create([
            "tujuan" => $request->tujuan,
            "fungsi" => $request->fungsi,
            "visi" => $request->visi,
            "misi" => $request->misi,
        ]);
        //5. response
        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $tentangdpm
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tentangdpm = TentangDpm::find($id);

        if(!$tentangdpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $tentangdpm
        ]);
    }

    public function update(Request $request, string $id)
    {
        //1, cari data
        $tentangdpm = TentangDpm::find($id);
        if(!$tentangdpm){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }
        //2. validator
        $validator = Validator::make($request->all(),[
            'tujuan' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'fungsi' => 'required|string|max:2000',
            'visi' => 'required|string|max:2000',
            'misi' => 'required|string|max:2000',
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }
        //3 siapkan data yang mau diupdate
        $data = [
            "tujuan" => $request->tujuan,
            "fungsi" => $request->fungsi,
            "visi" => $request->visi,
            "misi" => $request->misi,
        ];

        //4, update data
        $tentangdpm->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $tentangdpm
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tentangdpm = TentangDpm::find($id);
        if (!$tentangdpm){
            return response()->json([
                "success" => true,
                "messege" => "resourse not found",
            ]);
        }

        $tentangdpm->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }
}
