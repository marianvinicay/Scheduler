<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\User;

class AdminController extends Controller
{
    public function changeBalance(Request $request) {
        $uid = $request->id;
        $newBalance = $request->balance;

        $user = User::find($uid);
        
        if ($user) {
            $user->balance = $newBalance;
            $user->save();

            return response()->json($user, 200);

        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
}
