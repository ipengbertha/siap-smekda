<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@smekda.sch.id'],
            [
                'name' => 'Admin SIAP SMEKDA',
                'username' => 'admin',
                'birth_date' => '2000-01-01',
                'phone' => '081234567890',
                'class' => '-',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@smekda.sch.id'],
            [
                'name' => 'Ivana Bertha',
                'username' => 'ivanabertha',
                'birth_date' => '2005-01-01',
                'phone' => '081234567890',
                'class' => 'XII IPA 1',
                'password' => Hash::make('password'),
                'role' => 'user',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}