<?php
header('Content-Type: application/json');

// Suppress warnings in output
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE);

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'appointments'; // Ensure the correct database name

try {
    // Create database connection
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Prepare SQL statement
    $sql = "INSERT INTO appointment (
        patientName, 
        patientAge, 
        gender, 
        address, 
        state, 
        city, 
        zip, 
        doctor, 
        appointmentDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparing statement: " . $conn->error);
    }

    error_log(json_encode($_POST));
    $stmt->bind_param("sisssssss",
        $_POST['patientName'],
        $_POST['patientAge'],
        $_POST['gender'],
        $_POST['address'],
        $_POST['state'],
        $_POST['city'],
        $_POST['zip'],
        $_POST['doctor'],
        $_POST['appointmentDate']
    );

    // Execute the statement
    if (!$stmt->execute()) {
        throw new Exception("Error executing statement: " . $stmt->error);
    }

    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Appointment booked successfully'
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Log error
    error_log("Error: " . $e->getMessage());

    // Send error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>