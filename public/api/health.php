<?php
// Hostinger PHP Endpoint: GET /api/health
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$configFile = __DIR__ . '/../.resend-config.php';
$hasKey = file_exists($configFile);

echo json_encode([
    'status' => 'online',
    'service' => 'Kinetix Energy Platform API',
    'environment' => 'hostinger-apache-php',
    'php_version' => PHP_VERSION,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
    'version' => '1.0.0',
    'checks' => [
        'api_router' => 'healthy',
        'curl_extension' => function_exists('curl_init') ? 'healthy' : 'missing',
        'mailer_service' => $hasKey ? 'configured' : 'fallback_active'
    ]
], JSON_PRETTY_PRINT);
