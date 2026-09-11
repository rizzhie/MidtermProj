<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'name' => fake()->unique()->words(2, true),
            'price' => fake()->randomFloat(2, 3, 20),
            'image' => fake()->imageUrl(),
            'description' => fake()->sentence(),
            'is_available' => true,
        ];
    }
}
