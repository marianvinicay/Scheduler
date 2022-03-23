<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\PolicyController;
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
    Route::get('auth/user', [UserController::class, 'getCurrent']);
    Route::get('user/reservations', [ReservationController::class, 'getForCurrentUser']);

    Route::get('reservation/{id}', [ReservationController::class, 'get']);
    Route::get('reservation/for-date/{date}', [ReservationController::class, 'getForDate']);
    Route::post('reservation', [ReservationController::class, 'save']);
    Route::delete('reservation/{id}', [ReservationController::class, 'delete']);


    Route::middleware(['abilities:admin'])->group(function () {
        Route::get('user/{uid}', [UserController::class, 'get']);
        Route::get('users/count', [UserController::class, 'getCount']);
        Route::get('users/skip/{skip}/take/{take}', [UserController::class, 'getLimited']);
        Route::get('user/{uid}/policies', [PolicyController::class, 'getFor']);
        Route::get('user/{uid}/reservations', [ReservationController::class, 'getForUser']);
        Route::get('reservation/admin/for-date/{date}', [ReservationController::class, 'getForDateAdmin']);
        Route::post('user/balance', [AdminController::class, 'changeBalance']);

        Route::get('settings', [AdminSettingsController::class, 'get']);
        Route::post('settings', [AdminSettingsController::class, 'set']);

        Route::post('settings/policy', [PolicyController::class, 'create']);
        Route::delete('settings/policy/{pid}', [PolicyController::class, 'delete']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::delete('auth/logout', [AuthController::class, 'logout']);
});