<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The React frontend (Vite dev server, or its deployed origin) runs on a
    | different origin than this API, so the browser needs explicit CORS
    | permission to call it. Configure FRONTEND_URL in .env for production.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_map('trim', explode(',', env(
        'FRONTEND_URL',
        'http://localhost:5173,http://127.0.0.1:5173'
    )))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // We authenticate with a Bearer token (Authorization header), not
    // cookies, so credentials don't need to be shared across origins.
    'supports_credentials' => false,

];
