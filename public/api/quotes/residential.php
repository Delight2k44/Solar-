<?php
// Hostinger PHP Endpoint: POST /api/quotes/residential
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

$input = json_decode(file_get_contents('php://input'), true);

$fullName = trim($input['fullName'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$location = trim($input['suburb'] ?? ($input['city'] ?? 'Gauteng, South Africa'));
$installTarget = trim($input['installTarget'] ?? 'Within 2-4 weeks');
$monthlyBill = floatval($input['monthlyBillZAR'] ?? 4500);
$invKw = floatval($input['recommendedInverterKw'] ?? 8);
$batKwh = floatval($input['recommendedBatteryKwh'] ?? 10.24);
$pvKwp = floatval($input['recommendedSolarKwp'] ?? 5.5);

$errors = [];
if (strlen($fullName) < 2) $errors[] = 'Full name is required (minimum 2 characters)';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email address is required';
if (strlen($phone) < 7) $errors[] = 'A valid contact phone number is required';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Validation failed', 'details' => $errors]);
    exit;
}

$quoteId = 'KX-QT-' . rand(1000, 9999);
$ADMIN_EMAIL = 'form@kinetixes.com';
$FROM_EMAIL = 'Kinetix Energy <form@kinetixes.com>';

$configFile = __DIR__ . '/../../.resend-config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration missing']);
    exit;
}
require_once $configFile;

$recipients = [$ADMIN_EMAIL];
if (!empty($email) && $email !== $ADMIN_EMAIL) {
    $recipients[] = $email;
}

$safeName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeLocation = htmlspecialchars($location, ENT_QUOTES, 'UTF-8');
$safeTarget = htmlspecialchars($installTarget, ENT_QUOTES, 'UTF-8');

$emailHtml = "
<div style=\"font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;\">
  <div style=\"text-align:center;padding-bottom:24px;border-bottom:1px solid #1E2530;\">
    <h1 style=\"color:#00D2FF;margin:0;font-size:24px;letter-spacing:1px;\">⚡ KINETIX ENERGY</h1>
    <p style=\"color:#94A3B8;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;\">Engineering Proposal & Sizing Assessment</p>
  </div>
  <div style=\"margin:24px 0;\">
    <h2 style=\"color:#FFFFFF;font-size:18px;margin-bottom:8px;\">Proposal Reference: {$quoteId}</h2>
    <p style=\"color:#94A3B8;font-size:14px;line-height:1.6;margin:0;\">Hello {$safeName}, thank you for requesting an engineered solar proposal.</p>
  </div>
  <div style=\"background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:20px;\">
    <h3 style=\"color:#00D2FF;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;\">Client Profile</h3>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Name:</strong> <span style=\"color:#FFF;\">{$safeName}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Email:</strong> <span style=\"color:#FFF;\">{$safeEmail}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Phone:</strong> <span style=\"color:#FFF;\">{$safePhone}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Location:</strong> <span style=\"color:#FFF;\">{$safeLocation}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Target Install Date:</strong> <span style=\"color:#10B981;\">{$safeTarget}</span></p>
    <p style=\"margin:4px 0;font-size:13px;color:#94A3B8;\"><strong>Monthly Electricity Spend:</strong> <span style=\"color:#FFF;\">R " . number_format($monthlyBill) . " / mo</span></p>
  </div>
  <div style=\"background:#0D1117;border:1px solid #1E2530;border-radius:12px;padding:20px;margin-bottom:24px;\">
    <h3 style=\"color:#10B981;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-bottom:12px;\">Engineered System</h3>
    <p style=\"margin:6px 0;font-size:14px;color:#94A3B8;\"><strong>Inverter:</strong> <span style=\"color:#00D2FF;font-weight:bold;\">{$invKw} kW Pure Sine Wave</span></p>
    <p style=\"margin:6px 0;font-size:14px;color:#94A3B8;\"><strong>Battery:</strong> <span style=\"color:#00D2FF;font-weight:bold;\">{$batKwh} kWh Lithium</span></p>
    <p style=\"margin:6px 0;font-size:14px;color:#94A3B8;\"><strong>Solar PV:</strong> <span style=\"color:#00D2FF;font-weight:bold;\">{$pvKwp} kWp Monocrystalline</span></p>
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
    'subject' => "⚡ [System Proposal] Solar Quote {$quoteId} — {$safeName} ({$invKw}kW / {$batKwh}kWh)",
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

echo json_encode([
    'success' => true,
    'quoteId' => $quoteId,
    'message' => 'Residential quote proposal created and dispatched successfully',
    'recipients' => $recipients,
    'sizing' => [
        'inverterKw' => $invKw,
        'batteryKwh' => $batKwh,
        'solarKwp' => $pvKwp,
        'monthlyBillZAR' => $monthlyBill
    ],
    'http_code' => $httpCode,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
