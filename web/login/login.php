<?php 
include('../db.php');  

session_start();

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = $_POST['email'];
    $password = $_POST['password'];
    

    $sql = "SELECT email, user_id, role FROM users WHERE email='$username' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        // Αντιστοίχιση ρόλου από Ελληνικά σε Αγγλικά
        $rolemapping = [
            'Φοιτητής' => 'student',
            'Διδάσκων' => 'teacher',
            'Γραμματεία' => 'admin'
        ];

        $mappedrole = $rolemapping[$row['role']];

        $_SESSION['email'] = $username;
        $_SESSION['role'] = $mappedrole;
        $_SESSION['user_id'] = $row['user_id'];
        
        //JSON response
        $response = [
            'status' => 'success',
            'role' => $mappedrole,
            'user_id' => $row['user_id']
        ];
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Invalid username or password'
        ];
    }
} 
    
$conn->close();

echo json_encode($response);
?>


   
