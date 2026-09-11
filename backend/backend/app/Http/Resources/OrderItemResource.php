<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'image' => $this->image,
            'quantity' => $this->quantity,
            'line_total' => (float) $this->price * $this->quantity,
        ];
    }
}
