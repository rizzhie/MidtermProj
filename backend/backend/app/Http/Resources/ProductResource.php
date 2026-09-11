<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => (float) $this->price,
            // "category" mirrors the category's slug/key so the existing
            // frontend filter logic (product.category === activeCategory)
            // keeps working unchanged.
            'category' => $this->whenLoaded('category', fn () => $this->category?->key, $this->category?->key),
            'category_id' => $this->category_id,
            'image' => $this->image,
            'description' => $this->description,
            'is_available' => (bool) $this->is_available,
        ];
    }
}
