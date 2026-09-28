<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeritaDpmController;
use App\Http\Controllers\KeputusanController;
use App\Http\Controllers\KritikDpmController;
use App\Http\Controllers\PengaduanController;
use App\Http\Controllers\ProdukHukumController;
use App\Http\Controllers\StrukturDpmController;
use App\Http\Controllers\TentangDpmController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Auth ───────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api', 'role:admin');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ─── Public Routes (tanpa auth) ─────────────────────────
Route::get('/produkhukums',          [ProdukHukumController::class, 'index']);
Route::get('/produkhukums/{id}',     [ProdukHukumController::class, 'show']);

Route::get('/keputusans',            [KeputusanController::class, 'index']);
Route::get('/keputusans/{id}',       [KeputusanController::class, 'show']);

Route::get('/tentangdpms',           [TentangDpmController::class, 'index']);
Route::get('/tentangdpms/{id}',      [TentangDpmController::class, 'show']);

Route::get('/beritadpms',            [BeritaDpmController::class, 'index']);
Route::get('/beritadpms/{id}',       [BeritaDpmController::class, 'show']);

Route::get('/strukturdpms',          [StrukturDpmController::class, 'index']);
Route::get('/strukturdpms/{id}',     [StrukturDpmController::class, 'show']);

Route::post('/pengaduans',           [PengaduanController::class, 'store']);
Route::post('/kritikdpms',           [KritikDpmController::class, 'store']);

// ─── Admin Routes (butuh auth) ──────────────────────────
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::apiResource('/pengaduans',    PengaduanController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::apiResource('/kritikdpms',    KritikDpmController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::apiResource('/produkhukums',  ProdukHukumController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('/tentangdpms',   TentangDpmController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('/beritadpms',    BeritaDpmController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('/strukturdpms',  StrukturDpmController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('/keputusans',    KeputusanController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('/users',         AuthController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
});
