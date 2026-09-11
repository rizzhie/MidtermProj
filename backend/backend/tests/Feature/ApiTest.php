<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_categories_and_products(): void
    {
        $category = Category::factory()->create(['key' => 'cakes', 'label' => 'Cakes']);
        Product::factory()->create(['category_id' => $category->id, 'name' => 'Chocolate Cake']);

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonFragment(['key' => 'cakes']);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Chocolate Cake', 'category' => 'cakes']);
    }

    public function test_writing_products_requires_an_admin_token(): void
    {
        $category = Category::factory()->create();

        // No token at all.
        $this->postJson('/api/products', [
            'category_id' => $category->id,
            'name' => 'Nope',
            'price' => 5,
        ])->assertStatus(401);

        // A logged-in but non-admin user is forbidden.
        $user = User::factory()->create(['is_admin' => false]);
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/products', [
                'category_id' => $category->id,
                'name' => 'Nope',
                'price' => 5,
            ])->assertStatus(403);

        // An admin can create, update, and delete.
        $admin = User::factory()->create(['is_admin' => true]);

        $created = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/products', [
                'category_id' => $category->id,
                'name' => 'Butter Croissant',
                'price' => 4.5,
            ])->assertCreated()
            ->json('data');

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/products/{$created['id']}", ['price' => 5])
            ->assertOk()
            ->assertJsonPath('data.price', 5);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/products/{$created['id']}")
            ->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $created['id']]);
    }

    public function test_placing_an_order_recomputes_totals_server_side(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'price' => 10,
        ]);

        $response = $this->postJson('/api/orders', [
            'customer_name' => 'Alissa Zapanta',
            'customer_phone' => '+63 987 654 3210',
            'delivery_address' => '123 Sample St',
            'shipping_option' => 'standard',
            // Client sends a tampered/incorrect shipping price and the item
            // quantity only — the server must recompute subtotal/total from
            // the DB's current product price, not trust these numbers blindly
            // for the item price.
            'shipping_price' => 2,
            'payment_method' => 'cod',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ],
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.subtotal', 30);
        $response->assertJsonPath('data.total', 32);
        $response->assertJsonPath('data.status', 'pending');
        $response->assertJsonCount(1, 'data.items');

        $this->assertDatabaseHas('orders', ['customer_name' => 'Alissa Zapanta', 'total' => 32]);
    }

    public function test_admin_can_update_order_status(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create(['category_id' => $category->id, 'price' => 5]);
        $admin = User::factory()->create(['is_admin' => true]);

        $order = $this->postJson('/api/orders', [
            'customer_name' => 'Test Customer',
            'customer_phone' => '0000000000',
            'delivery_address' => 'Somewhere',
            'shipping_option' => 'pickup',
            'shipping_price' => 0,
            'payment_method' => 'cod',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->json('data');

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/orders/{$order['id']}/status", ['status' => 'preparing'])
            ->assertOk()
            ->assertJsonPath('data.status', 'preparing');

        $this->getJson("/api/orders/{$order['id']}")->assertStatus(401);
    }
}
