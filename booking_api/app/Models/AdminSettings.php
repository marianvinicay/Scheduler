<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminSettings extends Model
{
    use HasFactory;

    protected $primaryKey = 'the_only';

    protected $fillable = [
        'price',
        'slots',
        'minInc',
        'durations',
	    'start_time',
	    'end_time',
        'except_days',
    ];

    protected $casts = [
        'slots' => 'json',
        'durations' => 'json',
        'except_days' => 'json',
    ];

    protected $hidden = [
        'the_only',
    ];

    public $timestamps = false;
}
