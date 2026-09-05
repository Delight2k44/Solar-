<?php
// Resend Email Proxy — Kinetix Energy
// This file runs server-side on Hostinger (PHP + Apache), forwarding email requests to Resend API.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'POST only']);
    exit;
}

// Load API key from config file (kept separate for security)
$configFile = __DIR__ . '/../.resend-config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration missing']);
    exit;
}
require_once $configFile;
$ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['subject']) || empty($input['html'])) {
    echo json_encode(['success' => false, 'error' => 'Missing subject or html']);
    exit;
}

$payload = json_encode([
    'from'     => $input['from']     ?? 'Kinetix Energy <form@kinetixes.com>',
    'to'       => $input['to']       ?? $ADMIN_EMAILS,
    'reply_to' => $input['reply_to'] ?? null,
    'subject'  => $input['subject'],
    'html'     => $input['html'],
]);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $RESEND_API_KEY,
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT        => 15,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    echo json_encode(['success' => false, 'error' => 'cURL: ' . $curlErr]);
    exit;
}

$result = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'data' => $result]);
} else {
    // If domain is unverified, fallback to onboarding@resend.dev for delightchetter@gmail.com
    $errMsg = $result['message'] ?? '';
    if (strpos($errMsg, 'not verified') !== false || strpos($errMsg, 'validation_error') !== false) {
        $fbPayload = json_encode([
            'from'     => 'Kinetix Energy <onboarding@resend.dev>',
            'to'       => ['delightchetter@gmail.com'],
            'reply_to' => $input['reply_to'] ?? null,
            'subject'  => $input['subject'],
            'html'     => $input['html'],
        ]);
        $fbCh = curl_init('https://api.resend.com/emails');
        curl_setopt_array($fbCh, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $fbPayload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $RESEND_API_KEY,
                'Content-Type: application/json',
            ],
            CURLOPT_TIMEOUT        => 15,
        ]);
        $fbResp = curl_exec($fbCh);
        $fbCode = curl_getinfo($fbCh, CURLINFO_HTTP_CODE);
        curl_close($fbCh);

        if ($fbCode >= 200 && $fbCode < 300) {
            $fbResult = json_decode($fbResp, true);
            echo json_encode(['success' => true, 'data' => $fbResult, 'note' => 'Delivered via sandbox fallback']);
            exit;
        }
    }

    echo json_encode(['success' => false, 'error' => $result['message'] ?? 'Resend error', 'code' => $httpCode]);
}
