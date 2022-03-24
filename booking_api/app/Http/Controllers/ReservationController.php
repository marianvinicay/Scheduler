<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;

class ReservationController extends Controller
{
    public function get(Request $request, $id) {
        $user = $request->user();
        $reservation = Reservation::find($id);

        if ($reservation) {
            if ($reservation->user == $user || $user->isAdmin()) {
                return response()->json($reservation, 200);

            } else {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

        } else {
            return response()->json(['error' => 'Reservation not found'], 404);
        }

        return response()->json($reservation, 200);
    }

    public function getForUser($uid) {
        $user = User::find($uid);
        $reservations = $user->reservations;

        return response()->json($reservations, 200);
    }

    public function getForCurrentUser(Request $request) {
        $user = $request->user();
        $reservations = $user->reservations;

        return response()->json($reservations, 200);
    }

    public function getForDateAdmin($date) {
        $reservations = Reservation::whereDate('start', $date)->get();
        $reservations->each(function($reservation) {
            $reservation->user;
        });

        return response()->json($reservations, 200);
    }

    public function getForDate($date) {
        $reservations = Reservation::whereDate('start', $date)->get();
        
        $strippedReservations = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                "slot" => $reservation->slot,
                "start" => $reservation->start,
                "end" => $reservation->end,
            ];
        });

        return response()->json($strippedReservations, 200);
    }

    public function save(Request $request) {
        $user = $request->user();

        if ($user->canMakeReservation()) {
            $input = $request->all();
            $input['user_id'] = $user->id;

            $reservation = Reservation::create($input);
            
            if (!$reservation->user->madeReservation()) {
                $reservation->delete();
                return response()->json(['error' => 'Balance is not sufficient to make a reservation (E3)'], 403);
            }

            return response()->json($reservation, 201);
        
        } else {
            return response()->json(['error' => 'Balance is not sufficient to make a reservation'], 403);
        }
    }

    public function delete(Request $request, $rid) {
        $user = $request->user();
        $reservation = Reservation::find($rid);

        if ($reservation->user->id == $user->id) {
            $reservation->delete();
            return response()->json(['message' => 'Delete successful'], 204); // What does 204 mean?
        } else {
            return response()->json(['error' => 'You are not allowed to delete this reservation'], 403);
        }
    }

    public function deleteAdmin($rid) {
        $reservation = Reservation::find($rid);
        $reservation->delete();
        return response()->json(['message' => 'Delete successful'], 204);
    }
}
