<?php

header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/smtp-mailer.php';

$config = require __DIR__ . '/smtp-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$firstName = trim((string) ($_POST['fname'] ?? ''));
$lastName = trim((string) ($_POST['lname'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($firstName === '' || $lastName === '' || $phone === '' || $email === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required contact form fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
    exit;
}

$subject = 'New Contact Form Enquiry - Medyra Website';
$plainBody = implode("\n", [
    'New contact form enquiry received.',
    '',
    'First Name: ' . $firstName,
    'Last Name: ' . $lastName,
    'Phone: ' . $phone,
    'Email: ' . $email,
    'Message: ' . ($message !== '' ? $message : 'N/A'),
]);

$htmlBody = '<h2>New Contact Form Enquiry</h2>'
    . '<p><strong>First Name:</strong> ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Last Name:</strong> ' . htmlspecialchars($lastName, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Phone:</strong> ' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($message !== '' ? $message : 'N/A', ENT_QUOTES, 'UTF-8')) . '</p>';

$result = smtp_send_mail($config, $subject, $htmlBody, $plainBody, $email, $firstName . ' ' . $lastName);

if (!$result['success']) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $result['message']]);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Message sent successfully.']);
