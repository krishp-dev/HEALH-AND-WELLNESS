<?php
// Database configuration
$host = 'localhost';
$dbname = 'mood_tracker';
$username = 'root';
$password = '';

// Create a new database connection
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Get the request data
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'];

if ($action === 'signup') {
    // Signup logic
    $fullName = $data['fullName'];
    $age = $data['age'];
    $gender = $data['gender'];
    $email = $data['email'];
    $avatar = $data['avatar'];
    $registrationDate = date('Y-m-d H:i:s');

    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already registered.']);
        exit;
    }

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (fullName, age, gender, email, avatar, registrationDate) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$fullName, $age, $gender, $email, $avatar, $registrationDate]);
    
    echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
}

if ($action === 'login') {
    // Login logic
    $email = $data['email'];

    // Check if user exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['status' => 'success', 'user' => $user]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    }
}
?>
