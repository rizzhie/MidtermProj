<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $label = fake()->unique()->word();

        return [
            'key' => \Illuminate\Support\Str::slug($label),
            'label' => ucfirst($label),
        ];
    }
}
