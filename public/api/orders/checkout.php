<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success' => false, 'error' => 'POST only']); exit; }

$input = json_decode(file_get_contents('php://input'), true);
$customerName = trim($input['customerName'] ?? '');
$customerEmail = trim($input['customerEmail'] ?? '');
$customerPhone = trim($input['customerPhone'] ?? '');
$shippingAddress = trim($input['shippingAddress'] ?? '');

$errors = [];
if (strlen($customerName) < 2) $errors[] = 'Customer name is required';
if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (strlen($customerPhone) < 7) $errors[] = 'Contact phone is required';
if (strlen($shippingAddress) < 3) $errors[] = 'Delivery address is required';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Validation failed', 'details' => $errors]);
    exit;
}

$randNum = rand(100000, 999999);
$orderId = 'KX-ORD-' . $randNum;
$waybillNumber = 'TCG-ZA-' . $randNum;
$ADMIN_EMAIL = 'form@kinetixes.com';
$FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';
$city = trim($input['city'] ?? 'Johannesburg');
$total = number_format(floatval($input['totalCartZAR'] ?? 0), 2);

$configFile = __DIR__ . '/../../.resend-config.php';
$mailerResult = ['status' => 'logged'];

if (file_exists($configFile)) {
    require_once $configFile;
    if (!empty($RESEND_API_KEY)) {
        $recipients = [$ADMIN_EMAIL];
        if (!empty($customerEmail) && $customerEmail !== $ADMIN_EMAIL) {
            $recipients[] = $customerEmail;
        }

        $safeName = htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($customerEmail, ENT_QUOTES, 'UTF-8');
        $safePhone = htmlspecialchars($customerPhone, ENT_QUOTES, 'UTF-8');
        $safeAddress = htmlspecialchars($shippingAddress, ENT_QUOTES, 'UTF-8');
        $safeCity = htmlspecialchars($city, ENT_QUOTES, 'UTF-8');

        $html = "<div style=\"font-family:sans-serif;background:#05070A;color:#F1F5F9;padding:24px;border-radius:12px;max-width:600px;\">"
              . "<h2 style=\"color:#00D2FF;\">🛒 Order Confirmed #{$orderId}</h2>"
              . "<p><strong>Waybill:</strong> {$waybillNumber}</p>"
              . "<p><strong>Customer:</strong> {$safeName} ({$safePhone})</p>"
              . "<p><strong>Email:</strong> {$safeEmail}</p>"
              . "<p><strong>Shipping:</strong> {$safeAddress}, {$safeCity}</p>"
              . "<p><strong>Total:</strong> R {$total}</p>"
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
                'subject'  => "🛒 [Order Confirmed] #{$orderId} — {$safeName}",
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
    'orderId' => $orderId,
    'waybillNumber' => $waybillNumber,
    'message' => 'Order created and processed successfully',
    'mailer' => $mailerResult,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
