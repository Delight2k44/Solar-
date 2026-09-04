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

$input = json_decode(file_get_contents('php://input'), true);

$companyName = trim($input['companyName'] ?? '');
$contactName = trim($input['contactName'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$designation = trim($input['designation'] ?? 'Executive');
$facilityType = trim($input['facilityType'] ?? 'Commercial Facility');
$monthlySpend = trim($input['monthlySpend'] ?? 'R 50,000 – R 100,000 / month');
$peakKva = trim($input['peakKva'] ?? '100 kVA – 250 kVA');
$dieselMonthly = trim($input['dieselMonthly'] ?? 'None / Infrequent');
$locationCity = trim($input['locationCity'] ?? 'Gauteng, South Africa');
$taxSection12b = !empty($input['taxSection12b']);

$errors = [];
if (strlen($companyName) < 2) $errors[] = 'Company name is required';
if (strlen($contactName) < 2) $errors[] = 'Contact name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid corporate email address is required';
if (strlen($phone) < 7) $errors[] = 'A valid contact phone number is required';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Validation failed', 'details' => $errors]);
    exit;
}

$referenceId = 'KX-COMM-' . rand(1000, 9999);
$ADMIN_EMAIL = 'delightchetter@gmail.com';
$FROM_EMAIL = 'Kinetix Energy <onboarding@resend.dev>';

$recipients = [$ADMIN_EMAIL];
if (!empty($email) && $email !== $ADMIN_EMAIL) {
    $recipients[] = $email;
}

$safeCompany = htmlspecialchars($companyName, ENT_QUOTES, 'UTF-8');
$safeContact = htmlspecialchars($contactName, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeLocation = htmlspecialchars($locationCity, ENT_QUOTES, 'UTF-8');

$configFile = __DIR__ . '/../../.resend-config.php';
if (file_exists($configFile)) {
    require_once $configFile;
    $emailHtml = "
    <div style=\"font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#05070A;color:#F1F5F9;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #1E2530;\">
      <h1 style=\"color:#00D2FF;\">⚡ KINETIX ENERGY</h1>
      <h2>Commercial Audit Reference: #{$referenceId}</h2>
      <p>Company: {$safeCompany} | Contact: {$safeContact} ({$safePhone}) | Spend: {$monthlySpend}</p>
    </div>";

    $payload = json_encode([
        'from' => $FROM_EMAIL,
        'to' => $recipients,
        'reply_to' => $safeEmail,
        'subject' => "🏢 [Commercial Audit] {$safeCompany} ({$monthlySpend}) — #{$referenceId}",
        'html' => $emailHtml
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $RESEND_API_KEY, 'Content-Type: application/json'],
        CURLOPT_TIMEOUT => 15
    ]);
    curl_exec($ch);
    curl_close($ch);
}

echo json_encode([
    'success' => true,
    'referenceId' => $referenceId,
    'message' => 'Commercial energy audit registered successfully',
    'recipients' => $recipients,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
