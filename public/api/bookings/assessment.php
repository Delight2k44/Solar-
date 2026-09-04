<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success' => false, 'error' => 'POST only']); exit; }

$input = json_decode(file_get_contents('php://input'), true);
$clientName = trim($input['clientName'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$address = trim($input['address'] ?? '');

$errors = [];
if (strlen($clientName) < 2) $errors[] = 'Full name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (strlen($phone) < 7) $errors[] = 'Valid contact phone is required';
if (strlen($address) < 3) $errors[] = 'Site physical address is required';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Validation failed', 'details' => $errors]);
    exit;
}

$bookingId = 'KX-BKG-' . rand(1000, 9999);
$ADMIN_EMAILS = ['form@kinetixes.com', 'delightchetter@gmail.com'];
$FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';
$city = trim($input['city'] ?? 'Johannesburg');
$targetDate = trim($input['targetDate'] ?? 'Flexible');

$configFile = __DIR__ . '/../../.resend-config.php';
$mailerResult = ['status' => 'logged'];

if (file_exists($configFile)) {
    require_once $configFile;
    if (!empty($RESEND_API_KEY)) {
        $recipients = $ADMIN_EMAILS;
        if (!empty($email) && !in_array($email, $ADMIN_EMAILS)) {
            $recipients[] = $email;
        }

        $safeName = htmlspecialchars($clientName, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
        $safeAddress = htmlspecialchars($address, ENT_QUOTES, 'UTF-8');
        $safeCity = htmlspecialchars($city, ENT_QUOTES, 'UTF-8');

        $html = "<div style=\"font-family:sans-serif;background:#05070A;color:#F1F5F9;padding:24px;border-radius:12px;max-width:600px;\">"
              . "<h2 style=\"color:#00D2FF;\">📅 Site Assessment Booking #{$bookingId}</h2>"
              . "<p><strong>Client:</strong> {$safeName} ({$safePhone})</p>"
              . "<p><strong>Email:</strong> {$safeEmail}</p>"
              . "<p><strong>Site:</strong> {$safeAddress}, {$safeCity}</p>"
              . "<p><strong>Target Date:</strong> {$targetDate}</p>"
              . "</div>";

        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $RESEND_API_KEY,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS     => json_encode([
                'from'     => $FROM_EMAIL,
                'to'       => $recipients,
                'reply_to' => $safeEmail,
                'subject'  => "📅 [Site Assessment] #{$bookingId} — {$safeName} ({$safeCity})",
                'html'     => $html,
            ]),
            CURLOPT_TIMEOUT        => 8,
        ]);
        $resp = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $resData = json_decode($resp, true);
            $mailerResult = ['status' => 'delivered', 'resendId' => $resData['id'] ?? null];
        }
    }
}

echo json_encode([
    'success' => true,
    'bookingId' => $bookingId,
    'message' => 'Site assessment booking registered successfully',
    'mailer' => $mailerResult,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
