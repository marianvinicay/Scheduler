<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Verification\RegisterController;
use App\Http\Controllers\Verification\LoginController;

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

Route::middleware('auth:api')
    ->get('/user', function (Request $request) {
        return $request->user();
    });

Route::post('auth/register', [RegisterController::class, 'register']);
Route::post('auth/login', [LoginController::class, 'login']);
Route::delete('auth/logout', [LoginController::class, 'logout']);

Route::group(['middleware' => 'auth:api'], function() {
    Route::get('reservation/{id}', [ReservationController::class, 'get']);
    Route::get('reservation/for-user/{uid}', [ReservationController::class, 'getForUser']);
    Route::get('reservation/for-date/{date}', [ReservationController::class, 'getForDate']);
    Route::post('reservation', [ReservationController::class, 'save']);
    Route::delete('reservation/{id}', [ReservationController::class, 'delete']);
}); 