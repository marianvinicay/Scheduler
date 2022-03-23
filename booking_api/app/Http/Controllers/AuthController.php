<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Validator;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Policy;

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

    protected function packUserWithToken(User $user, $name, $policies)
    {
        $newToken = $user->createToken($name, $policies);
        
        $userData = $this->packUser($user);
        $userData['token'] = $newToken->plainTextToken;

        $setPolicies = $newToken->accessToken->abilities;

        return [
            'user' => $userData,
            'policy' => $setPolicies,
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
        Policy::create([
            'user_id' => $user->id,
            'type' => 'user',
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
            $user = Auth::user();

            return response()->json($this->packUserWithToken($user, 'web', $user->formattedPolicies()), 202);

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
