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

$user_id = $_SESSION['user_id'];

// Βρες τη διπλωματική του φοιτητή
$sql = "SELECT tb.grade, tb.paper, tb.link
        FROM themata_b tb
        JOIN students s ON tb.student_id = s.student_id
        WHERE s.user_id = $user_id AND tb.grade IS NOT NULL";


$result = $conn->query($sql);
if (!$result || $result->num_rows === 0) {
    echo json_encode(['error' => 'Δεν βρέθηκε σχετική διπλωματική']);
    exit();
}

$data = $result->fetch_assoc();

echo json_encode([
    'grade_exists' => !is_null($data['grade']),
    'paper' => $data['paper'],
    'link' => $data['link']
]);
?>