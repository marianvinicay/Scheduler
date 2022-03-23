<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Policy;

class PolicyController extends Controller
{
    public function create(Request $request) {
        $policy = Policy::create($request->all());
        $policy->user;

        return response()->json($policy, 201);
    }

    public function getFor($uid) {
        $policies = Policy::where('user_id', $uid)->get();
        return response()->json($policies, 200);
    }

    public function delete($pid) {
        $policy = Policy::find($pid);
        $policy->delete();
        
        return response()->json(['message' => 'Delete successful'], 204); // What does 204 mean?
    }
}
