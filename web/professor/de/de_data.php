<?php
session_start();
include('../../db.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$themata_a_id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($themata_a_id === 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit();
}

// Παίρνουμε τα βασικά στοιχεία + themata_b_id
$sql = "SELECT a.title, b.status, b.start_date, b.end_date, b.date_en, b.date_yexams,
               s.student_id, s.name, s.surname, b.themata_b_id, b.grade
        FROM themata_a AS a
        INNER JOIN themata_b AS b ON a.themata_a_id = b.themata_a_id
        INNER JOIN students AS s ON b.student_id = s.student_id
        WHERE a.themata_a_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $themata_a_id);
$stmt->execute();
$result = $stmt->get_result();
$data = [];

if ($row = $result->fetch_assoc()) {
   
    $themata_b_id = $row['themata_b_id'];

$sql_profs = "SELECT p.name, p.surname, t.role, g.grade, g.created_at AS create_date
              FROM trimelis AS t
              INNER JOIN professors AS p ON t.professor_id = p.professor_id
              LEFT JOIN grades AS g ON g.professor_id = t.professor_id AND g.themata_b_id = t.themata_b_id
              WHERE t.themata_b_id = ?";

$stmt_profs = $conn->prepare($sql_profs);

if (!$stmt_profs) {
    echo json_encode(['error' => 'Query error: ' . $conn->error]);
    exit();
}

$stmt_profs->bind_param("i", $themata_b_id);
$stmt_profs->execute();
$res_profs = $stmt_profs->get_result();

$professors = [];
while ($prof = $res_profs->fetch_assoc()) {
    $professors[] = $prof;
}

$row['professors'] = $professors;
unset($row['themata_b_id']);

$data[] = $row;

}

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
