<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Access\AuthorizationException;

use App\Models\User;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function verify(Request $request)
    {
        $uid = $request->route('id');
        $user = User::find($uid);

        if (! hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            throw new AuthorizationException;
        }

        if ($user->hasVerifiedEmail()) {
            return response()->redirectTo('/login');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->redirectTo('/login?verified=true');
    }

    /**
     * Send the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function send(Request $request)
    {
        $uid = $request->route('id');
        $user = User::find($uid);
        $user->sendEmailVerificationNotification();

        return response()->json(['success' => 'Verification email has been resent!'], 200);
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resend(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        $user->sendEmailVerificationNotification();

        return response()->json(['success' => 'Verification email has been resent!'], 200);
    }
}

