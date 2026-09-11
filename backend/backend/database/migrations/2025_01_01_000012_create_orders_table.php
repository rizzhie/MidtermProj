<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('delivery_address');
            $table->date('delivery_date')->nullable();
            $table->string('delivery_time_slot')->nullable();
            $table->string('shipping_option'); // e.g. "standard", "pickup"
            $table->decimal('shipping_price', 8, 2)->default(0);
            $table->string('payment_method'); // e.g. "cod", "card", "gcash"
            $table->text('note')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('status')->default('pending'); // pending, preparing, out_for_delivery, completed, cancelled
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
