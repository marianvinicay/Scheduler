<?php

namespace App\Providers;

use Illuminate\Auth\EloquentUserProvider as UserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Carbon\Carbon;


class CustomUserProvider extends UserProvider {
    public function retrieveByCredentials(array $credentials)
    {
        $user = parent::retrieveByCredentials($credentials);

        if (!$user) { return; }

        $created = $user->api_token_created_at;
        $now = Carbon::now();
        $diff = $now->diffInMinutes($created);

        if ($diff > 30) {
            return;
        }
        else {
            return $user;
        }
    }
}