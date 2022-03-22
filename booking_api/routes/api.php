<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('user', [UserController::class, 'getCurrent']);
    Route::get('user/reservations', [ReservationController::class, 'getForCurrentUser']);

    Route::get('user/{uid}', [UserController::class, 'get'])
        ->middleware(['abilities:admin']);
    Route::get('user/{uid}/reservations', [ReservationController::class, 'getForUser'])
        ->middleware(['abilities:admin']);

    Route::get('reservation/{id}', [ReservationController::class, 'get']);
    Route::get('reservation/for-date/{date}', [ReservationController::class, 'getForDate']);
    Route::post('reservation', [ReservationController::class, 'save']);
    Route::delete('reservation/{id}', [ReservationController::class, 'delete']);

    Route::post('user/balance', [AdminController::class, 'changeBalance'])
        ->middleware(['abilities:admin']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::delete('auth/logout', [AuthController::class, 'logout']);
});