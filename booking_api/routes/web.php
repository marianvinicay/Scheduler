<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\VerifyEmailController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect(Config::get('app.url') . ':3000');
});

Route::get('/verif-notice', function () {
    return redirect(Config::get('app.url') . ':3000/email-not-verified');
})->name('verification.notice');

Route::get('/login', function () {
    return redirect(Config::get('app.url') . ':3000/login');
})->name('login');

Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, "verify"])->name('verification.verify');
Route::get('/email/verify/send/{id}', [VerifyEmailController::class, "send"])->name('verification.send');
Route::post('/email/verify/send', [VerifyEmailController::class, "resend"]);
