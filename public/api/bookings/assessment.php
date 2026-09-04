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
echo json_encode([
    'success' => true,
    'bookingId' => $bookingId,
    'message' => 'Site assessment booking registered successfully',
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
