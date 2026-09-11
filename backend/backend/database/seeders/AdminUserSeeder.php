<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@angelsbakery.test'],
            [
                'name' => 'Angels Admin',
                'password' => 'password', // hashed automatically via the 'hashed' cast
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
