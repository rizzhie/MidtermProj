<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        // Supports GET /api/products?category=cakes to match the frontend's
        // menu filter tabs.
        if ($request->filled('category') && $request->query('category') !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('key', $request->query('category'));
            });
        }

        return ProductResource::collection(
            $query->orderBy('name')->get()
        );
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated())->load('category');

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }
}
