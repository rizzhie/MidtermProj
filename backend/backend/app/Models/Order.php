<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUSES = [
        'pending',
        'preparing',
        'out_for_delivery',
        'completed',
        'cancelled',
    ];

    /**
     * Forward-only status ladder. An order can only move to one of the
     * listed statuses for its current status — it can never go backwards
     * (e.g. "preparing" can never return to "pending").
     */
    public const STATUS_TRANSITIONS = [
        'pending' => ['preparing', 'cancelled'],
        'preparing' => ['out_for_delivery', 'cancelled'],
        'out_for_delivery' => ['completed'],
        'completed' => [],
        'cancelled' => [],
    ];

    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'delivery_address',
        'delivery_date',
        'delivery_time_slot',
        'shipping_option',
        'shipping_price',
        'payment_method',
        'note',
        'subtotal',
        'total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'delivery_date' => 'date',
            'shipping_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest('id');
    }

    public function canTransitionTo(string $status): bool
    {
        return in_array($status, static::STATUS_TRANSITIONS[$this->status] ?? [], true);
    }

    public function logStatus(string $status): void
    {
        $this->statusHistories()->create(['status' => $status]);
    }
}
