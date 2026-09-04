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
echo json_encode([
    'success' => true,
    'ticketId' => $ticketId,
    'message' => 'Maintenance ticket created successfully',
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
