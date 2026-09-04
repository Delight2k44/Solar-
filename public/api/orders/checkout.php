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

echo json_encode([
    'success' => true,
    'orderId' => $orderId,
    'waybillNumber' => $waybillNumber,
    'message' => 'Order created and processed successfully',
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
