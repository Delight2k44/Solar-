<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success' => false, 'error' => 'POST only']); exit; }

$input = json_decode(file_get_contents('php://input'), true);
$clientName = trim($input['clientName'] ?? '');
$clientEmail = trim($input['clientEmail'] ?? '');
$clientPhone = trim($input['clientPhone'] ?? '');

$errors = [];
if (strlen($clientName) < 2) $errors[] = 'Full name is required';
if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (strlen($clientPhone) < 7) $errors[] = 'Valid phone is required';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Validation failed', 'details' => $errors]);
    exit;
}

$ticketId = 'KX-SRV-' . rand(1000, 9999);
$ADMIN_EMAIL = 'form@kinetixes.com';
$FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';
$tier = trim($input['tier'] ?? 'Standard SLA');
$inverterBrand = trim($input['inverterBrand'] ?? 'Solar System');
$primaryReason = trim($input['primaryReason'] ?? 'Support Request');
$details = trim($input['issueDetails'] ?? 'None provided');

$configFile = __DIR__ . '/../../.resend-config.php';
$mailerResult = ['status' => 'logged'];

if (file_exists($configFile)) {
    require_once $configFile;
    if (!empty($RESEND_API_KEY)) {
        $recipients = [$ADMIN_EMAIL];
        if (!empty($clientEmail) && $clientEmail !== $ADMIN_EMAIL) {
            $recipients[] = $clientEmail;
        }

        $safeName = htmlspecialchars($clientName, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($clientEmail, ENT_QUOTES, 'UTF-8');
        $safePhone = htmlspecialchars($clientPhone, ENT_QUOTES, 'UTF-8');
        $safeTier = htmlspecialchars($tier, ENT_QUOTES, 'UTF-8');
        $safeBrand = htmlspecialchars($inverterBrand, ENT_QUOTES, 'UTF-8');
        $safeReason = htmlspecialchars($primaryReason, ENT_QUOTES, 'UTF-8');
        $safeDetails = htmlspecialchars($details, ENT_QUOTES, 'UTF-8');

        $html = "<div style=\"font-family:sans-serif;background:#05070A;color:#F1F5F9;padding:24px;border-radius:12px;max-width:600px;\">"
              . "<h2 style=\"color:#00D2FF;\">🛠️ Maintenance Ticket #{$ticketId}</h2>"
              . "<p><strong>Client:</strong> {$safeName} ({$safePhone})</p>"
              . "<p><strong>Email:</strong> {$safeEmail}</p>"
              . "<p><strong>Tier:</strong> {$safeTier}</p>"
              . "<p><strong>Hardware:</strong> {$safeBrand}</p>"
              . "<p><strong>Reason:</strong> {$safeReason}</p>"
              . "<p><strong>Details:</strong> {$safeDetails}</p>"
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
                'subject'  => "🛠️ [Maintenance Ticket] #{$ticketId} — {$safeName}",
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
    'ticketId' => $ticketId,
    'message' => 'Maintenance ticket created successfully',
    'mailer' => $mailerResult,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
