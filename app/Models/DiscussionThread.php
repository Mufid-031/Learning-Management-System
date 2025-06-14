<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiscussionThread extends Model
{
    /** @use HasFactory<\Database\Factories\DiscussionThreadFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'category',
        'likes',
        'resolved',
        'user_id',
    ];

    protected $casts = [
        'resolved' => 'boolean',
    ];

    public function replies(): HasMany
    {
        return $this->hasMany(Reply::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
