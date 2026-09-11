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

    protected $fillable = [
        'customer_name',
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
}
