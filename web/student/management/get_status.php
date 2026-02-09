<?php
session_start();
include('../../db.php');

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => null]);
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT tb.status
        FROM themata_b tb
        JOIN students s ON tb.student_id = s.student_id
        WHERE s.user_id = $user_id
        ORDER BY tb.themata_b_id DESC LIMIT 1";

$result = $conn->query($sql);
if ($row = $result->fetch_assoc()) {
    echo json_encode(['status' => $row['status']]);
} else {
    echo json_encode(['status' => null]);
}
?>