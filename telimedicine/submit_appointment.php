<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "appointments";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Insert into appointments table
        $sql = "INSERT INTO appointment (
            patient_name,
            patient_type,
            last_visit_date,
            last_visit_reason,
            patient_age,
            gender,
            email,
            phone_number,
            address,
            blood_type,
            visit_reason,
            state,
            city,
            doctor,
            allergies,
            other_allergies,
            insurance_provider,
            policy_number,
            appointment_date,
            status
        ) VALUES (
            :patientName,
            :patientType,
            :lastVisitDate,
            :lastVisitReason,
            :patientAge,
            :gender,
            :email,
            :phoneNumber,
            :address,
            :bloodType,
            :visitReason,
            :state,
            :city,
            :doctor,
            :allergies,
            :otherAllergies,
            :insuranceProvider,
            :policyNumber,
            :appointmentDate,
            'scheduled'
        )";

        $stmt = $conn->prepare($sql);

        // Prepare allergies data
        $allergies = isset($_POST['allergies']) ? implode(',', $_POST['allergies']) : '';

        // Bind parameters with matching form names
        $stmt->bindParam(':patientName', $_POST['patientName']);
        $stmt->bindParam(':patientType', $_POST['patientType']);
        $stmt->bindParam(':lastVisitDate', $_POST['lastVisitDate']);
        $stmt->bindParam(':lastVisitReason', $_POST['lastVisitReason']);
        $stmt->bindParam(':patientAge', $_POST['patientAge']);
        $stmt->bindParam(':gender', $_POST['gender']);
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->bindParam(':phoneNumber', $_POST['phoneNumber']);
        $stmt->bindParam(':address', $_POST['address']);
        $stmt->bindParam(':bloodType', $_POST['bloodType']);
        $stmt->bindParam(':visitReason', $_POST['visitReason']);
        $stmt->bindParam(':state', $_POST['state']);
        $stmt->bindParam(':city', $_POST['city']);
        $stmt->bindParam(':doctor', $_POST['doctor']);
        $stmt->bindParam(':allergies', $allergies);
        $stmt->bindParam(':otherAllergies', $_POST['otherAllergies']);
        $stmt->bindParam(':insuranceProvider', $_POST['insuranceProvider']);
        $stmt->bindParam(':policyNumber', $_POST['policyNumber']);
        $stmt->bindParam(':appointmentDate', $_POST['appointmentDate']);

        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Appointment booked successfully!"
        ]);

    } catch(PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error: " . $e->getMessage()
        ]);
    }

    $conn = null;
}

?>