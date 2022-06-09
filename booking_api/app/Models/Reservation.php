<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Reservation extends Model
{
    use HasFactory;

    protected $appends = ['start_date', 'end_date'];

    protected $fillable = [
	    'user_id',
        'slot',
	    'start',
        'end',
        'timezone',
        'paid',
    ];

    protected $hidden = [
        'user_id',
        'start',
        'end',
    ];

    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
    ];

    public function getStartDateAttribute()
    {   
        $utcTimezone = new \DateTimeZone('UTC');
        $date = $this->start;
        $date->setTimezone($utcTimezone);
        
        $date->setTimezone(new \DateTimeZone($this->timezone));
        return $date->format('Y-m-d H:i');
    }

    public function getEndDateAttribute()
    {   
        $utcTimezone = new \DateTimeZone('UTC');
        $date = $this->end;
        $date->setTimezone($utcTimezone);

        $date->setTimezone(new \DateTimeZone($this->timezone));
        return $date->format('Y-m-d H:i');
    }

    /**
     * Get the post that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
