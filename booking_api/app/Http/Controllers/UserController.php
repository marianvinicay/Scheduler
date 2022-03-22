<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{
    public function getCurrent(Request $request) {
        $user = $request->user();
        if ($user) {
            $success = [
                'user' => $user,
                'policy' => $user->currentAccessToken()->abilities,
            ];
            return response()->json($success, 200);
            
        } else {
            return response()->json(['error' => 'No user is active'], 404);
        }
    }

    public function get($uid) {
        $user = User::find($uid);
        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
}
