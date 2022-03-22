<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
	    'user_id',
        'slot',
	    'start',
        'end'
    ];

    /**
     * Get the post that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
