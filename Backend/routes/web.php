<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BeritaDpmController; // <-- Jangan lupa panggil Controllernya

Route::get('/', function () {
    return view('welcome');
});

// Route khusus untuk share ke WhatsApp / Sosmed
Route::get('/share/informasi/{slug}', [BeritaDpmController::class, 'share']);
