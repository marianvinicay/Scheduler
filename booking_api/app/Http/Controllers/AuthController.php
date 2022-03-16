<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Validator;

class AuthController extends Controller
{
    protected function validator(array $data) 
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    protected function registered(Request $request, $user) 
    {
        $user->generateToken();

        return response()->json(['data' => $user->toArray()], 201);
    }

    protected function create(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            //'balance' => 0.0,
            'password' => bcrypt($data['password']),
        ]);

        return $user; 
    }

    public function register(Request $request) {
        $this->validator($request->all())->validate();

        $user = $this->create($request->all());

        event(new Registered($user));

        $user->generateToken();

        $success["id"] = $user->id;
        $success["name"] = $user->name;
        $success["email"] = $user->email;
        $success["token"] = $user->api_token;
        $success["token_created_at"] = $user->api_token_created_at;

        return response()->json($success, 201);;
    }

    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) { 
            $auth = Auth::user(); 
            $auth->generateToken(); 
            $success['name'] =  $auth->name;
   
            return response()->json($success, 201);
            
        } else { 
            return response()->json("", 401);
        } 
/*
        $this->validateLogin($request);
        
        if ($this->attemptLogin($request)) {
            $user = $this->guard()->user();
            $user->generateToken();

            return response()->json([
                'data' => $user->toArray(),
            ]);
        }

        return $this->sendFailedLoginResponse($request);*/
    }

    public function logout(Request $request)
    {
        $user = Auth::guard('api')->user();

        if ($user) {
            $user->api_token = null;
            $user->api_token_created_at = null;
            $user->save();
        }

        return response()->json(['data' => 'User logged out.'], 200);
    }
}
