<?php
session_start();
include('../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id="SELECT student_id FROM students WHERE user_id=$user_id";
            $residResult = $conn->query($id);
            $resid = $residResult->fetch_assoc()['student_id'];


$sql = "SELECT * FROM students AS s INNER JOIN users AS u ON s.user_id = u.user_id
WHERE s.student_id = $resid"; 
$studentName = $conn->query($sql);

if ($studentName->num_rows > 0) {
    // Αποθήκευση δεδομένων σε πίνακα
    $students = [];
    while ($row = $studentName->fetch_assoc()) {
        $students[] = $row; 
    }
    // Επιστροφή JSON απόκρισης
    echo json_encode($students);
} else {
    echo json_encode([]); 
}
?>