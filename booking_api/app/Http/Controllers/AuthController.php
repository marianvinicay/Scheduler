<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Validator;

use App\Http\Controllers\Controller;
use App\Models\User;

class AuthController extends Controller
{
    protected function packUser(User $user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'balance' => $user->balance,
        ];
    }

    protected function packUserWithToken(User $user, $name, $policy)
    {
        $newToken = $user->createToken($name, [$policy]);
        
        $userData = $this->packUser($user);
        $userData['token'] = $newToken->plainTextToken;

        $policy = $newToken->accessToken->abilities;

        return [
            'user' => $userData,
            'policy' => $policy,
        ];
    }

    protected function validator(array $data) 
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    protected function create(array $data)
    {
        $email = $data['email'];
        $user = User::create([
            'name' => $data['name'],
            'email' => $email,
            'password' => bcrypt($data['password']),
            'balance' => $data['balance'] ?? 0.0,
        ]);

        return $user; 
    }

    public function register(Request $request) {
        $this->validator($request->all())->validate();

        $user = $this->create($request->all());

        event(new Registered($user));

        return response()->json($this->packUser($user), 201);;
    }

    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) { 
            $auth = Auth::user();

            if ($auth->isAdmin()) {
                return response()->json($this->packUserWithToken($auth, 'web_lp', "admin"), 202);
            }

            return response()->json($this->packUserWithToken($auth, 'web_l', "user"), 202);

        } else { 
            return response()->json(['error' => 'Unauthorized'], 401);
        } 
    }

    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->tokens()->delete();
            return response()->json(['message' => 'User logged out.'], 200);
        }

        return response()->json(['message' => 'Nothing'], 400);
    }
}
