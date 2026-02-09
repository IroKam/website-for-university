<?php
session_start();
include('../../db.php');

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Δεν είστε συνδεδεμένος']);
    exit();
}

$student_user_id = $_SESSION['user_id'];

// Βρες themata_b_id του φοιτητή με διπλωματική "Υπό Εξέταση"
$sql = "SELECT themata_b_id FROM themata_b 
        WHERE student_id = (SELECT student_id FROM students WHERE user_id = $student_user_id)
        AND status = 'Υπό εξέταση'";

$result = $conn->query($sql);
if (!$result || $result->num_rows === 0) {
    echo json_encode(['error' => 'Δεν βρέθηκε διπλωματική υπό εξέταση']);
    exit();
}
$row = $result->fetch_assoc();
$themata_b_id = $row['themata_b_id'];

// Ανάγνωση δεδομένων από POST
$datetime = $_POST['exam_datetime'] ?? null;
$method = $_POST['method'] ?? null;
$details = $_POST['details'] ?? null;

if (!$datetime || !$method || !$details) {
    echo json_encode(['error' => 'Όλα τα πεδία είναι υποχρεωτικά.']);
    exit();
}

// Καταχώρηση εγγραφής
$sql = "INSERT INTO exetasi_info (themata_b_id, exam_datetime, method, details)
        VALUES ($themata_b_id, '$datetime', '$method', '$details')";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Σφάλμα καταχώρησης: ' . $conn->error]);
}
?>