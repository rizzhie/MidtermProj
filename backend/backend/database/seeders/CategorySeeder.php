<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['key' => 'cakes', 'label' => 'Cakes'],
            ['key' => 'cupcakes', 'label' => 'Cupcakes'],
            ['key' => 'pastries', 'label' => 'Pastries'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['key' => $category['key']], $category);
        }
    }
}
