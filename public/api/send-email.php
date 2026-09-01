<?php
// Resend Email Proxy — Kinetix Energy
// Runs server-side on Hostinger (PHP + Apache), forwarding email requests to the Resend API.
//
// The API key is never stored in this file. Provide it either as a RESEND_API_KEY
// environment variable or in an untracked ../.resend-config.php that sets $RESEND_API_KEY.

header('Content-Type: application/json');
header('Vary: Origin');

$ALLOWED_ORIGINS = ['https://kinetixes.com', 'https://www.kinetixes.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'POST only']);
    exit;
}

$RESEND_API_KEY = getenv('RESEND_API_KEY') ?: '';
if ($RESEND_API_KEY === '') {
    $configFile = __DIR__ . '/../.resend-config.php';
    if (file_exists($configFile)) {
        require_once $configFile;
    }
}

if (empty($RESEND_API_KEY)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Email service is not configured']);
    exit;
}

$FROM_EMAIL  = getenv('RESEND_FROM_EMAIL') ?: 'Kinetix Energy <noreply@kinetixes.com>';
$ADMIN_EMAIL = getenv('KINETIX_ADMIN_EMAIL') ?: 'delightchetter@gmail.com';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['subject']) || empty($input['html'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing subject or html']);
    exit;
}

$recipients = $input['to'] ?? [$ADMIN_EMAIL];
if (!is_array($recipients)) {
    $recipients = [$recipients];
}
$recipients = array_values(array_filter($recipients, function ($address) {
    return is_string($address) && filter_var($address, FILTER_VALIDATE_EMAIL);
}));

if (count($recipients) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No valid recipient']);
    exit;
}

$replyTo = $input['reply_to'] ?? null;
if (!is_string($replyTo) || !filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
    $replyTo = null;
}

// The sender is fixed server-side so the endpoint cannot be used to spoof other domains.
$payload = array_filter([
    'from'     => $FROM_EMAIL,
    'to'       => $recipients,
    'reply_to' => $replyTo,
    'subject'  => (string) $input['subject'],
    'html'     => (string) $input['html'],
], function ($value) {
    return $value !== null;
});

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
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
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Upstream request failed']);
    exit;
}

$result = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'data' => $result]);
} else {
    http_response_code($httpCode);
    echo json_encode(['success' => false, 'error' => $result['message'] ?? 'Resend error', 'code' => $httpCode]);
}
