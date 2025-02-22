<?php
include 'db_configure.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['full_name'] = $row['full_name'];
         
            echo"<script> localStorage.setItem('islog','t');  window.location.href = 'http://localhost/haw/homepagenew2.html';</script>";
            
        
        } else {
            echo "Invalid password!";
            echo "<script>localStorage.removeItem('islog');</script>";
        }
    } else {
        echo "No user found with this email!";
    }
}
?>
