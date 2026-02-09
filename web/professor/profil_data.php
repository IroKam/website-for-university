<?php
session_start();
include('../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id="SELECT professor_id FROM professors WHERE user_id=$user_id";
            $residResult = $conn->query($id);
            $resid = $residResult->fetch_assoc()['professor_id'];


$sql = "SELECT name, surname, department, office_contact,email FROM professors AS p INNER JOIN users AS u ON p.user_id = u.user_id
WHERE p.professor_id = $resid"; 
$professorName = $conn->query($sql);

if ($professorName->num_rows > 0) {
    // Αποθήκευση δεδομένων σε πίνακα
    $professors = [];
    while ($row = $professorName->fetch_assoc()) {
        $professors[] = $row; 
    }
    // Επιστροφή JSON απόκρισης
    echo json_encode($professors);
} else {
    echo json_encode([]); 
}