<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

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

    protected function getUTCDate($value)
    {   
        $date = \DateTime::createFromFormat('Y-m-d H:i', $value, new \DateTimeZone($this->timezone));
        $date->setTimezone(new \DateTimeZone('UTC'));
        return $date->format('Y-m-d H:i:s');
    }

    protected function getTimezonedDate($value, $timezone)
    {   
        $date = \DateTime::createFromFormat('Y-m-d H:i:s', $value, new \DateTimeZone('UTC'));  
        $date->setTimezone(new \DateTimeZone($timezone));
        return $date->format('Y-m-d H:i:s');
    }

    protected function startDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $this->getTimezonedDate($attributes['start'], $attributes['timezone']),
            set: fn ($value) => ['start' => $this->getUTCDate($value)],
        );
    }

    protected function endDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $this->getTimezonedDate($attributes['end'], $attributes['timezone']),
            set: fn ($value) => ['end' => $this->getUTCDate($value)],
        );
    }

    public function getStartDateForTimezone($timezone)
    {
        return $this->getTimezonedDate($this->start, $timezone);
    }

    public function getEndDateForTimezone($timezone)
    {
        return $this->getTimezonedDate($this->end, $timezone);
    }

    /**
     * Get the post that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
