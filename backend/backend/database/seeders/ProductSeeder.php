<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('key');

        $products = [
            [
                'name' => 'Chocolate cake',
                'price' => 150,
                'category' => 'cakes',
                'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
                'description' => 'Rich dark cocoa layers with a glossy ganache drip.',
            ],
            [
                'name' => 'Red velvet cake',
                'price' => 150,
                'category' => 'cakes',
                'image' => 'https://images.unsplash.com/photo-1586985289906-406988974504?auto=format&fit=crop&w=600&q=80',
                'description' => 'Velvety crumb with tangy cream cheese frosting.',
            ],
            [
                'name' => 'Matcha cake',
                'price' => 140,
                'category' => 'cakes',
                'image' => 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=600&q=80',
                'description' => 'Earthy Uji matcha sponge, lightly sweetened.',
            ],
            [
                'name' => 'Ube cake',
                'price' => 130,
                'category' => 'cakes',
                'image' => 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80',
                'description' => 'Purple yam layers with a delicate coconut note.',
            ],
            [
                'name' => 'Chocolate cupcake',
                'price' => 55,
                'category' => 'cupcakes',
                'image' => 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80',
                'description' => 'Fudgy cupcake piped high with chocolate buttercream.',
            ],
            [
                'name' => 'Vanilla cupcake',
                'price' => 45,
                'category' => 'cupcakes',
                'image' => 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80',
                'description' => 'Classic Madagascar vanilla with swiss meringue.',
            ],
            [
                'name' => 'Butter croissant',
                'price' => 25,
                'category' => 'pastries',
                'image' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
                'description' => 'Laminated 36 hours for a shatter-crisp finish.',
            ],
            [
                'name' => 'Cinnamon roll',
                'price' => 30,
                'category' => 'pastries',
                'image' => 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80',
                'description' => 'Soft-baked spiral finished with cream cheese glaze.',
            ],
        ];

        foreach ($products as $product) {
            $categoryKey = $product['category'];
            unset($product['category']);

            Product::updateOrCreate(
                ['name' => $product['name']],
                [...$product, 'category_id' => $categories[$categoryKey]->id]
            );
        }
    }
}
