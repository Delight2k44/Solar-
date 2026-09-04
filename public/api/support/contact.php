<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST.']);
    exit;
}

$configFile = __DIR__ . '/../../.resend-config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration missing (.resend-config.php)']);
    exit;
}
require_once $configFile;

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? 'N/A');
$subject = trim($input['subject'] ?? 'General Technical Inquiry');
$message = trim($input['message'] ?? '');

$errors = [];
if (strlen($name) < 2) $errors[] = 'Name is required (minimum 2 characters)';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email address is required';
if (strlen($message) < 5) $errors[] = 'Message is required (minimum 5 characters)';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Validation failed', 'details' => $errors]);
    exit;
}

$inquiryId = 'KX-ENQ-' . rand(1000, 9999);
$ADMIN_EMAIL = 'form@kinetixes.com';
$FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>';

$recipients = [$ADMIN_EMAIL];
if (!empty($email) && $email !== $ADMIN_EMAIL) {
    $recipients[] = $email;
}

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$emailHtml = "
<div style=\"font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;\">
  <div style=\"text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;\">
    <h1 style=\"color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;\">⚡ KINETIX ENERGY</h1>
    <p style=\"color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;\">Technical Support & Inquiry Desk</p>
  </div>
  <div style=\"margin:24px 0;\">
    <h2 style=\"color:#FFFFFF;font-size:18px;margin-bottom:8px;\">Inquiry Received (Ref #{$inquiryId})</h2>
    <p style=\"color:#94A3B8;font-size:14px;line-height:1.6;margin:0;\">Hello {$safeName}, we have received your technical inquiry.</p>
  </div>
  <div style=\"background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;\">
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>From:</strong> <span style=\"color:#FFF;\">{$safeName}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Email:</strong> <span style=\"color:#FFF;\">{$safeEmail}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Phone:</strong> <span style=\"color:#FFF;\">{$safePhone}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Subject:</strong> <span style=\"color:#00D2FF;\">{$safeSubject}</span></p>
    <hr style=\"border:0;border-top:1px solid #1E2530;margin:12px 0;\">
    <p style=\"margin:0;font-size:13px;color:#E2E8F0;line-height:1.6;\">{$safeMessage}</p>
  </div>
  <div style=\"text-align:center;border-top:1px solid #1E2530;padding-top:20px;color:#64748B;font-size:12px;\">
    <p style=\"margin:4px 0;\">WhatsApp Hotline: <strong style=\"color:#00D2FF;\">+27 78 780 8569</strong></p>
    <p style=\"margin-top:12px;font-size:11px;\">© 2026 Kinetix Energy Technologies (Pty) Ltd.</p>
  </div>
</div>
";

$payload = json_encode([
    'from' => $FROM_EMAIL,
    'to' => $recipients,
    'reply_to' => $safeEmail,
    'subject' => "💬 [Inquiry Received] {$safeSubject} — {$safeName} ({$inquiryId})",
    'html' => $emailHtml
]);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $RESEND_API_KEY,
        'Content-Type: application/json'
    ],
    CURLOPT_TIMEOUT => 15
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode([
        'success' => true,
        'message' => 'Inquiry processed successfully',
        'inquiryId' => $inquiryId,
        'recipients' => $recipients,
        'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
    ]);
} else {
    http_response_code($httpCode ?: 500);
    echo json_encode([
        'success' => false,
        'error' => $result['message'] ?? 'Resend API error',
        'inquiryId' => $inquiryId
    ]);
}
