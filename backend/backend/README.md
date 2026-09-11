# Angel's Cakes and Pastries — API

Laravel 12 REST API powering the [Angel's Cakes and Pastries frontend](../frontend). Provides
CRUD for the menu (categories + products) and orders, with admin writes protected by
[Laravel Sanctum](https://laravel.com/docs/sanctum) bearer tokens.

## Setup

### 1. Install dependencies

`laravel/sanctum` was added to `composer.json` but the lock file wasn't regenerated in this
environment (no network access to Packagist here), so run this once:

```bash
composer update laravel/sanctum
```

If you're using the included Docker setup, the app container's entrypoint runs
`composer install` automatically on first boot — but it needs the lock file to already list
Sanctum, so run the command above on the host first (or `composer install && composer require laravel/sanctum`
if you'd rather let Composer resolve it fresh).

### 2. Environment

```bash
cp .env.example .env
```

Defaults match the included `docker-compose.yaml` (MySQL). Update `FRONTEND_URL` if your Vite
dev server runs on a different port than `5173`.

### 3a. Run with Docker (recommended — matches docker-compose.yaml)

```bash
docker compose up -d --build
```

This builds the app, starts MySQL + phpMyAdmin, generates `APP_KEY`, runs migrations, and
**seeds the database** (menu + admin user) automatically on every boot — seeders use
`updateOrCreate`, so re-running them is safe. The API is served at `http://localhost:3001`.

### 3b. Run locally without Docker

```bash
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve   # http://localhost:8000
```

(Point `DB_CONNECTION`/`DB_*` in `.env` at whatever MySQL/SQLite instance you're using.)

## Seeded data

- **Menu**: the same categories/products the frontend used to hardcode (cakes, cupcakes,
  pastries), so the storefront looks identical once wired up.
- **Admin account**: `admin@angelsbakery.test` / `password` — used to log into `/admin` on the
  frontend and exercise the protected write endpoints.

## API overview

Base URL: `http://localhost:8000/api` (or `http://localhost:3001/api` under Docker).

| Method | Endpoint                  | Auth  | Description                              |
|--------|----------------------------|-------|-------------------------------------------|
| GET    | `/categories`               | —     | List categories                           |
| GET    | `/categories/{id}`          | —     | Show a category                           |
| POST   | `/categories`                | admin | Create a category                         |
| PUT    | `/categories/{id}`          | admin | Update a category                         |
| DELETE | `/categories/{id}`          | admin | Delete a category                         |
| GET    | `/products`                  | —     | List products (`?category=cakes` filter)  |
| GET    | `/products/{id}`            | —     | Show a product                            |
| POST   | `/products`                   | admin | Create a product                          |
| PUT    | `/products/{id}`            | admin | Update a product                          |
| DELETE | `/products/{id}`            | admin | Delete a product                          |
| POST   | `/orders`                     | —     | Place an order (public checkout)          |
| GET    | `/orders`                     | admin | List orders (`?status=pending` filter)    |
| GET    | `/orders/{id}`               | admin | Show an order with its items              |
| PATCH  | `/orders/{id}/status`       | admin | Update fulfillment status                 |
| DELETE | `/orders/{id}`               | admin | Delete an order                           |
| POST   | `/login`                      | —     | Admin login → returns a bearer token      |
| POST   | `/logout`                     | admin | Revoke the current token                  |
| GET    | `/me`                          | admin | Current admin's profile                   |

Admin routes require `Authorization: Bearer <token>` from `/login`. Order totals are always
recalculated server-side from current product prices — the client only ever sends
`product_id` + `quantity`.

## Tests

```bash
php artisan test
```
