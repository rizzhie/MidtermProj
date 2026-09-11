<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Admin: list orders, most recent first, newest status changes included.
     */
    public function index(Request $request)
    {
        $query = Order::query()->with('items')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        return OrderResource::collection($query->paginate(20));
    }

    /**
     * Public: place a new order from the cart/checkout flow.
     *
     * Prices are always recomputed server-side from the current product
     * prices in the database — the client only sends product_id + quantity,
     * so a tampered subtotal in the browser can't change what gets charged.
     */
    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();

        $order = DB::transaction(function () use ($data) {
            $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))
                ->get()
                ->keyBy('id');

            $subtotal = 0;
            $lineItems = [];

            foreach ($data['items'] as $line) {
                $product = $products->get($line['product_id']);

                if (! $product) {
                    continue;
                }

                $quantity = (int) $line['quantity'];
                $lineTotal = $product->price * $quantity;
                $subtotal += $lineTotal;

                $lineItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image' => $product->image,
                    'quantity' => $quantity,
                ];
            }

            $shippingPrice = (float) $data['shipping_price'];

            $order = Order::create([
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'delivery_address' => $data['delivery_address'],
                'delivery_date' => $data['delivery_date'] ?? null,
                'delivery_time_slot' => $data['delivery_time_slot'] ?? null,
                'shipping_option' => $data['shipping_option'],
                'shipping_price' => $shippingPrice,
                'payment_method' => $data['payment_method'],
                'note' => $data['note'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal + $shippingPrice,
                'status' => 'pending',
            ]);

            $order->items()->createMany($lineItems);

            return $order;
        });

        return (new OrderResource($order->load('items')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Admin: view a single order with its items.
     */
    public function show(Order $order)
    {
        return new OrderResource($order->load('items'));
    }

    /**
     * Admin: update an order's fulfillment status.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $order->update(['status' => $request->validated()['status']]);

        return new OrderResource($order->load('items'));
    }

    /**
     * Admin: delete an order.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(null, 204);
    }
}
