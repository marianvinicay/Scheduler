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
            if ($reservation->user->id == $user->id || $user->isAdmin()) {
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
        $isAdmin = $request->user()->isAdmin();

        $today = new \DateTime('now', new \DateTimeZone('UTC'));
        $timestampDiff = $today->getTimestamp() - $date->getTimestamp();

        $reservations->each(function($reservation) {
            $reservation->user;
            $reservation->editable = ($timestampDiff < 0) && ($isAdmin);
        });

        return response()->json($reservations, 200);
    }

    public function getForDate(Request $request, $date, $timezone1, $timezone2) {
        $user = $request->user();
        $reservations = Reservation::whereDate('start', $date)->get();
        $timezone = $timezone1 . '/' . $timezone2;

        $today = new \DateTime('now', new \DateTimeZone('UTC'));
        $limitDay = (new \DateTime('now', new \DateTimeZone('UTC')))->add(new \DateInterval('P1D'));
        $timestampDiff = $today->getTimestamp() - (new \DateTime($date, new \DateTimeZone($timezone)))->getTimestamp();
        $limitDiff = $today->getTimestamp() - $limitDay->getTimestamp();
        $sufficientTimeDiff = $timestampDiff < $limitDiff;

        $strippedReservations = $reservations->map(function ($reservation) use ($user, $timezone, $sufficientTimeDiff) {
            $mine = $reservation->user->id == $user->id;
            return [
                'id' => $reservation->id,
                'mine' => $mine,
                "slot" => $reservation->slot,
                "start_date" => $reservation->getStartDateForTimezone($timezone),
                "end_date" => $reservation->getEndDateForTimezone($timezone),
                "timezone" => $timezone,
                'editable' => $sufficientTimeDiff && $mine,
            ];
        });

        return response()->json($strippedReservations, 200);
    }

    public function save(Request $request) {
        $user = $request->user();
        error_log($user->isAdmin());
        if ($user->isAdmin() || $user->canMakeReservation()) {

            $input = $request->all();
            $input['user_id'] = $user->id;
            $input['paid'] = true;

            $reservation = Reservation::create($input);
            $reservation->start_date = $input['start_date'];
            $reservation->end_date = $input['end_date'];

            $doesOverlap = Reservation::where('slot', '=', $reservation->slot)
                ->whereBetween('start', [$reservation->start, $reservation->end])
                ->orWhereBetween('end', [$reservation->start, $reservation->end])
                ->exists();

            if ($doesOverlap) {
                $reservation->delete();
                return response()->json(['error' => 'Overlapping reservation'], 400);
            }
            
            if (!$user->isAdmin() && !$reservation->user->madeReservation()) {
                $reservation->delete();
                return response()->json(['error' => 'Balance is not sufficient to make a reservation (E3)'], 403);
            }

            $reservation->save();
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
            return response()->json(['error' => 'You are not allowed to delete this reservation'], 401);
        }
    }

    public function deleteAdmin($rid) {
        $reservation = Reservation::find($rid);
        $reservation->delete();
        return response()->json(['message' => 'Delete successful'], 204);
    }
}
