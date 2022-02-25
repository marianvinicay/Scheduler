<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Reservation;

use Illuminate\Http\Request;


class ReservationController extends Controller {

    public function get($id) {
        $reservation = Reservation::find($id);

        return response()->json($reservation, 200);
    }

    public function getForUser($uid) {
        $reservations = Reservation::where('user', $uid)->get();

        return response()->json($reservations, 200);
    }

    public function getForDate($date) {
        $reservations = Reservation::whereDate('start', $date)->get();

        return response()->json($reservations, 200);
    }

    public function save(Request $request) {
        $reservation = Reservation::create($request->all());

        return response()->json($reservation, 201);
    }

    public function delete(Reservation $reservation) {
        $reservation->delete();

        return response()->json(null, 204);
    }
}
