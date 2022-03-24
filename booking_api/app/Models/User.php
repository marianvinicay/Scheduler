<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Admin;
use App\Models\AdminSettings;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'balance',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the reservations for the user.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'user_id');
    }

    /**
     * Get the reservations for the user.
     */
    public function policies()
    {
        return $this->hasMany(Policy::class, 'user_id');
    }

    public function isAdmin()
    {
        return $this->policies()->where('type', 'admin')->exists();
    }

    public function formattedPolicies()
    {  
        $policies = array();
        $this->policies()->get()->each(function($policy) use (&$policies) {
            array_push($policies, $policy->type);
        });
        return $policies;
    }

    public function canMakeReservation() 
    {
        $currentPrice = AdminSettings::first()->price;
        
        if ($this->balance < $currentPrice) {
            return false;
        }

        return true;
    }

    public function madeReservation() 
    {
        $currentPrice = AdminSettings::first()->price;
        
        if ($this->balance < $currentPrice) {
            return false;
        }

        $this->balance -= $currentPrice;
        $this->save();

        return true;
    }
}
