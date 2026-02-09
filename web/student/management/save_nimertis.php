<?php
session_start();
include('../../db.php');

header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Δεν είστε συνδεδεμένος']);
    exit();
}

$user_id = $_SESSION['user_id'];
$link = trim($_POST['link'] ?? '');

if (!filter_var($link, FILTER_VALIDATE_URL)) {
    echo json_encode(['error' => 'Μη έγκυρος σύνδεσμος']);
    exit();
}

$sql = "UPDATE themata_b 
        SET link = '$link' 
        WHERE student_id = (
            SELECT student_id FROM students WHERE user_id = $user_id
        )";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Σφάλμα καταχώρησης']);
}
?>