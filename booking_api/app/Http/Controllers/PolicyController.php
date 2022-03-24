<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Policy;
use App\Models\User;

class PolicyController extends Controller
{
    public function getFor($uid) {
        $policies = Policy::where('user_id', $uid)->get();
        return response()->json($policies, 200);
    }
    
    public function create(Request $request) {
        $policy = Policy::create($request->all());
        $policy->user;

        return response()->json($policy, 201);
    }

    public function setForUser(Request $request) {
        $uid = $request->user_id;
        $newPolicies = $request->policies;

        Policy::where('user_id', $uid)->delete();

        foreach ($newPolicies as $policy) {
            Policy::create([
                'user_id' => $uid,
                'type' => $policy,
            ]);
        }

        $user = User::find($uid);
        $user->policies;

        return response()->json($user, 201);
    }
    
    public function delete($pid) {
        $policy = Policy::find($pid);
        $policy->delete();
        
        return response()->json(['message' => 'Delete successful'], 204); // What does 204 mean?
    }
}
