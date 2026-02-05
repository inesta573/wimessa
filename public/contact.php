<?php
/**
 * Contact form handler for WIMESSA website.
 * Receives POST data, validates, sends email via PHP mail(), returns JSON.
 *
 * Required on server: CONTACT_EMAIL (or set $contactEmail below).
 * SiteGround supports PHP mail().
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST to submit the contact form.']);
    exit;
}

// --- Configuration ---
// contact-config.php (gitignored, created during deploy from CONTACT_EMAIL secret)
// See contact-config.example.php and .github/workflows/deploy.yml
$contactEmail = null;
$configFile = __DIR__ . '/contact-config.php';
if (file_exists($configFile)) {
    include $configFile;
}
if (!$contactEmail) {
    $contactEmail = getenv('CONTACT_EMAIL') ?: null;
}
if (empty($contactEmail) || !is_string($contactEmail) || !filter_var(trim($contactEmail), FILTER_VALIDATE_EMAIL)) {
    http_response_code(503);
    echo json_encode(['error' => 'Contact form is not configured. Set CONTACT_EMAIL secret in GitHub Actions.']);
    exit;
}
$contactEmail = trim($contactEmail);

$maxName = 200;
$maxEmail = 254;
$maxSubject = 300;
$maxMessage = 5000;
$emailRegex = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';

// --- Get and validate input ---
$name = isset($_POST['name']) ? trim((string) $_POST['name']) : '';
$email = isset($_POST['email']) ? trim((string) $_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim((string) $_POST['subject']) : '';
$message = isset($_POST['message']) ? trim((string) $_POST['message']) : '';

// Support JSON body (fetch sends JSON)
$contentType = $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (is_array($data)) {
        $name = isset($data['name']) ? trim((string) $data['name']) : $name;
        $email = isset($data['email']) ? trim((string) $data['email']) : $email;
        $subject = isset($data['subject']) ? trim((string) $data['subject']) : $subject;
        $message = isset($data['message']) ? trim((string) $data['message']) : $message;
    }
}

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name is required.']);
    exit;
}
if (strlen($name) > $maxName) {
    http_response_code(400);
    echo json_encode(['error' => "Name must be at most {$maxName} characters."]);
    exit;
}
if (empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required.']);
    exit;
}
if (!preg_match($emailRegex, $email) || strlen($email) > $maxEmail) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide a valid email address.']);
    exit;
}
if (strlen($subject) > $maxSubject) {
    http_response_code(400);
    echo json_encode(['error' => "Subject must be at most {$maxSubject} characters."]);
    exit;
}
if (empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required.']);
    exit;
}
if (strlen($message) > $maxMessage) {
    http_response_code(400);
    echo json_encode(['error' => "Message must be at most {$maxMessage} characters."]);
    exit;
}

// --- Build email ---
$mailSubject = $subject ? "[Contact Form] {$subject}" : "[Contact Form] Message from {$name}";

$body = "════════════════════════════════════════\n";
$body .= "  WIMESSA WEBSITE — NEW INQUIRY\n";
$body .= "════════════════════════════════════════\n\n";
$body .= "FROM\n";
$body .= "  Name:   {$name}\n";
$body .= "  Email:  {$email}\n";
if ($subject) {
    $body .= "  Subject: {$subject}\n";
}
$body .= "────────────────────────────────────────\n";
$body .= "MESSAGE\n";
$body .= "────────────────────────────────────────\n\n";
$body .= $message . "\n\n";
$body .= "────────────────────────────────────────\n";
$body .= "Reply to this email to respond to the sender.\n";
$body .= "════════════════════════════════════════\n";

// Prevent header injection
$name = str_replace(["\r", "\n"], '', $name);
$email = str_replace(["\r", "\n"], '', $email);

$headers = [
    'From: "Contact form: ' . $name . '" <noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
];

// --- Send ---
$sent = @mail($contactEmail, $mailSubject, $body, implode("\r\n", $headers));

if ($sent) {
    http_response_code(200);
    echo json_encode(['message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again later.']);
}
