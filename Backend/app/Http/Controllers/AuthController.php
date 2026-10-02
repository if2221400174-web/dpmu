<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function login(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors(),422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token =auth()->guard('api')->attempt($credentials)){
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password anda salah !'
            ], 401);
        }

        $user = auth()->guard('api')->user();

        // JALUR VIP ADMIN
        if (is_null($user->email_verified_at) && $user->email !== 'mohdzikrillah03@gmail.com') {
            auth()->guard('api')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Harap aktifkan/verifikasi email Anda terlebih dahulu!'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successfully',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request){
        try{
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['success' => true, 'message' => 'Logout successfully'], 200);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'message' => 'Logout failed'], 500);
        }
    }

    public function index() {
        $user = User::all();
        if($user->isEmpty()){
            return response()->json(["success"=>true, "message" => "resource data not found"], 200);
        }
        return response()->json(["success"=> true, "message" => "Get all resource", "data" => $user], 200);
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            "email" => "required|email|max:455|unique:users,email",
            "password" => "required|min:8"
        ], ['email.unique' => 'Gagal! Email ini sudah terdaftar di sistem.']);

        if($validator->fails()){
            return response()->json(["success"=>false, "message" => $validator->errors()], 400);
        }

        $otp = rand(100000, 999999);
        $cacheKey = 'register_otp_' . $request->email;

        Cache::put($cacheKey, [
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? 'user',
            'otp' => $otp
        ], now()->addMinutes(10));

        // PENJEBAK ERROR EMAIL
        try {
            Mail::send([], [], function ($message) use ($request, $otp) {
                $message->to($request->email)
                        ->subject('Kode Verifikasi (OTP) - DPM UNUJA')
                        ->html("
                            <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
                                <h2>Kode Verifikasi Anda</h2>
                                <p>Seseorang mencoba mendaftarkan email ini di sistem DPM UNUJA.</p>
                                <p>Masukkan 6 digit kode berikut untuk menyelesaikan pendaftaran:</p>
                                <h1 style='letter-spacing: 5px; color: #2563EB;'>{$otp}</h1>
                                <p style='color: #666; font-size: 12px;'>Kode ini akan kedaluwarsa dalam 10 menit.</p>
                            </div>
                        ");
            });
        } catch (\Exception $e) {
            Cache::forget($cacheKey);
            return response()->json([
                "success" => false,
                "message" => "Gagal mengirim email SMTP: " . $e->getMessage()
            ], 500);
        }

        return response()->json([
            "success" => true,
            "message" => "Kode OTP telah dikirim ke email.",
            "data" => ["email" => $request->email],
            "debug_otp" => $otp, // KODE RAHASIA JIKA EMAIL TIDAK MASUK
            "require_otp" => true
        ], 200);
    }

    public function verifyOtpStore(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric'
        ]);

        $cacheKey = 'register_otp_' . $request->email;
        $cachedData = Cache::get($cacheKey);

        if (!$cachedData) return response()->json(['success' => false, 'message' => 'Kode OTP sudah kedaluwarsa atau email tidak ditemukan.'], 400);

        if ((string)$cachedData['otp'] !== (string)$request->otp) {
            return response()->json(['success' => false, 'message' => 'Kode OTP salah!'], 400);
        }

        $user = User::create([
            'email' => $cachedData['email'],
            'password' => $cachedData['password'],
            'role' => $cachedData['role'],
        ]);

        $user->email_verified_at = Carbon::now();
        $user->save();
        Cache::forget($cacheKey);

        return response()->json(["success" => true, "message" => "Verifikasi berhasil! User telah ditambahkan.", "data" => $user], 201);
    }

    public function show(string $id){
        $user = User::find($id);
        if(!$user) return response()->json(["success"=>false, "message" => "resource not found"], 404);
        return response()->json(["success" => true, "message" => "Get resource", "data" => $user]);
    }

    public function update(Request $request, string $id){
        $user = User::find($id);
        if(!$user) return response()->json(["success"=>false, "message" => "resource not found"], 404);

        $validator = Validator::make($request->all(),[
            "email" => "required|email|max:455|unique:users,email," . $id,
            "role" => "required|string|in:admin,user|max:100"
        ], ['email.unique' => 'Gagal! Email ini sudah dipakai oleh user lain.']);

        if($validator->fails()) return response()->json(["success"=>false, "message" => $validator->errors()], 400);

        $newPassword = $user->password;
        if ($request->has('password') && !empty($request->password)) {
            $newPassword = bcrypt($request->password);
        }

        if ($user->email === $request->email && !is_null($user->email_verified_at)) {
            $user->update(['password' => $newPassword, 'role' => $request->role]);
            return response()->json(["success" => true, "message" => "Data berhasil diperbarui tanpa perubahan email.", "data" => $user], 200);
        }

        $otp = rand(100000, 999999);
        $cacheKey = 'update_otp_' . $user->id;

        Cache::put($cacheKey, [
            'new_email' => $request->email,
            'password' => $newPassword,
            'role' => $request->role,
            'otp' => $otp
        ], now()->addMinutes(10));

        // PENJEBAK ERROR EMAIL UPDATE
        try {
            Mail::send([], [], function ($message) use ($request, $otp) {
                $message->to($request->email)
                        ->subject('Konfirmasi Perubahan Email - DPM UNUJA')
                        ->html("
                            <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
                                <h2>Kode Verifikasi Email Baru</h2>
                                <p>Seseorang mengedit data akun Anda. Masukkan 6 digit kode berikut untuk memverifikasi perubahan email:</p>
                                <h1 style='letter-spacing: 5px; color: #2563EB;'>{$otp}</h1>
                                <p style='color: #666; font-size: 12px;'>Kode ini akan kedaluwarsa dalam 10 menit.</p>
                            </div>
                        ");
            });
        } catch (\Exception $e) {
            Cache::forget($cacheKey);
            return response()->json([
                "success" => false,
                "message" => "Gagal mengirim email SMTP: " . $e->getMessage()
            ], 500);
        }

        return response()->json([
            "success" => true,
            "message" => "Kode OTP telah dikirim ke email baru.",
            "debug_otp" => $otp, // KODE RAHASIA
            "require_otp" => true
        ], 200);
    }

    public function verifyOtpUpdate(Request $request, string $id)
    {
        $request->validate(['otp' => 'required|numeric']);
        $user = User::find($id);

        if(!$user) return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);

        $cacheKey = 'update_otp_' . $user->id;
        $cachedData = Cache::get($cacheKey);

        if (!$cachedData) return response()->json(['success' => false, 'message' => 'Kode OTP sudah kedaluwarsa.'], 400);

        if ((string)$cachedData['otp'] !== (string)$request->otp) {
            return response()->json(['success' => false, 'message' => 'Kode OTP salah!'], 400);
        }

        $user->email = $cachedData['new_email'];
        $user->password = $cachedData['password'];
        $user->role = $cachedData['role'];
        $user->email_verified_at = Carbon::now();
        $user->save();
        Cache::forget($cacheKey);

        return response()->json(["success" => true, "message" => "Pembaruan berhasil disimpan!", "data" => $user], 200);
    }

    public function destroy(string $id){
        $user = User::find($id);
        if(!$user) return response()->json(["success"=>false, "message" => "resourse not found"], 404);
        $user->delete();
        return response() ->json(["success" =>true, "message" => "resource deleted", "data" => $user], 200);
    }
}
