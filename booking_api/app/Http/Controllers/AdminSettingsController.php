<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\AdminSettings;

class AdminSettingsController extends Controller
{
    public function get(Request $request) {
        $settings = AdminSettings::first();
        
        if ($settings) {
            return response()->json($settings, 200);

        } else {
            return response()->json(['error' => 'Settings not found'], 404);
        }
    }

    public function set(Request $request) {
        $settings = AdminSettings::first();
        if (!$settings) {
            $settings = AdminSettings::create($request->all());
        } else {
            $settings->fill($request->all());
        }
        $settings->save();

        return response()->json($settings, 200);
    }
}
