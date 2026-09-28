<?php

namespace App\Http\Controllers;

use App\Models\KritikDpm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KritikDpmController extends Controller
{
    public function index()
    {
        $kritik = KritikDpm::All();

        if ($kritik->isEmpty()){
            return response()->json([
                "success"=> true,
                "messege" => "resource data not found"
            ], 200);
        }
        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $kritik,
        ], 200);
    }
    public function store(Request $request)
    {
        //1 validator
        $validator = Validator::make($request->all(),[
            'kritik' => 'required|string|max:2000',
            'saran' => 'required|string|max:2000',

        ]);

        //2. check validator eror
        if ($validator->fails()){
            return response()->json([
                "success"=> false,
                "message" => $validator->errors()
            ], 422);
        };
        //4. insert data
        $kritik = KritikDpm::create([
            "kritik" => $request->kritik,
            "saran" => $request->saran,
        ]);
        //5. response
        return response()->json([
            "success"=> true,
            "message" => "resource add successfully!",
            "data" => $kritik
        ],200);
    }

    public function show(string $id)
    {
        $kritik = KritikDpm::find($id);

        if(!$kritik){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $kritik
        ]);
    }

    public function update(Request $request, string $id)
    {
        //1, cari data
        $kritik = KritikDpm::find($id);
        if(!$kritik){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }
        //2. validator
        $validator = Validator::make($request->all(),[
            'kritik' => 'required|string|max:2000',
            'saran' => 'required|string|max:2000'
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }
        //3 siapkan data yang mau diupdate
        $data = [
            "kritik" => $request->kritik,
            "saran" => $request->saran,
        ];

        //4, update data
        $kritik->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $kritik
        ], 200);
    }

    public function destroy(string $id)
    {
        $kririk = KritikDpm::find($id);
        if (!$kririk){
            return response()->json([
                "success" => true,
                "messege" => "resourse not found",
            ]);
        }

        $kririk ->delete();
        return response()->json([
            "success" => true,
            "messege" => "resourse deleted successfully",
        ]);
    }
}
