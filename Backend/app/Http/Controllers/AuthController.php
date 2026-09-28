<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request){
        //1. setup validator
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required'
        ]);

        //2. cek validator
        if ($validator->fails()){
            return response()->json($validator->errors(),422);
        }
        //3. get kredensial dari request
        $credentials = $request->only('email', 'password');

        //4. cek isFailed
        if (!$token =auth()->guard('api')->attempt($credentials)){
            return response()->json([
                'success' => false,
                'message' => 'Email atau Pasword anda salah !'
            ], 401);
        }

        //5. cek is Success
        return response()->json([
            'success' => true,
            'message' => 'Login successfully',
            'user' => auth()->guard('api')->user(),
            'token' =>$token,
        ], 200);
    }

    public function logout(Request $request){
        try{
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Logout successfully'
            ], 200);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 500);
        }
    }

    //CRUD
    public function index() {
        $user = User::all();

        if($user->isEmpty()){
            return response()->json([
                "success"=>true,
                "messege" => "resource data not found"
            ], 200);
        }

        return response()->json([
            "success"=> true,
            "messege" => "Get all resource",
            "data" => $user
        ], 200);
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            "email" => "required|email|max:455",
            "password" => "required|min:8"
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }
        $user = User::create([
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'admin'

        ]);

        return response()->json([
            "success" => true,
            "messege" => "resource created",
            "data" => $user,
        ], 201);
    }

    //show
    public function show(string $id){
        $user = User::find($id);

        if(!$user){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "messege" => "Get resource",
            "data" => $user
        ]);
    }

    //update
    public function update(Request $request, string $id){
        //1, cari data
        $user = User::find($id);
        if(!$user){
            return response()->json([
                "success"=>false,
                "messege" => "resource not found"
            ], 404);
        }
        //2. validator
        $validator = Validator::make($request->all(),[
            "email" => "required|email|max:455",
            "role" => "required|string|in:admin,member|max:100"
        ]);

        if($validator->fails()){
            return response()->json([
                "success"=>false,
                "messege" => $validator->errors()
            ], 400);
        }
        //3 siapkan data yang mau diupdate
        $data = [
            'email' => $request->email,
            'role' => $request->role
        ];

        //4, update data
        $user->update($data);
        return response()->json([
            "success" => true,
            "messege" => "resource updated",
            "data" => $user
        ], 200);
    }
     //delete
    public function destroy(string $id){
        $user = User::find($id);
        if(!$user){
            return response()->json([
                "success"=>false,
                "messege" => "resourse not found"
            ], 404);
        }
        $user->delete();
        return response() ->json([
            "success" =>true,
            "messege" => "resource deleted",
            "data" => $user
        ], 200);
    }
}
