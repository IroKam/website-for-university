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

// Βρες τις περατωμένες διπλωματικές του φοιτητή
$sql = "
SELECT tb.themata_b_id, tb.status, tb.start_date, tb.end_date, tb.date_en, tb.date_yexams,
       tb.grade, tb.link, tb.paper,
       ta.title, ta.description, ta.pdf_file
FROM themata_b tb
JOIN themata_a ta ON tb.themata_a_id = ta.themata_a_id
JOIN students s ON tb.student_id = s.student_id
WHERE s.user_id = $user_id AND tb.status = 'Περατωμένη'
";

$result = $conn->query($sql);
if (!$result) {
    echo json_encode(['error' => 'Σφάλμα SQL: ' . $conn->error]);
    exit();
}

$completed = [];

while ($row = $result->fetch_assoc()) {
    $themata_b_id = $row['themata_b_id'];

    // Φέρε την τριμελή επιτροπή
    $committee_sql = "
        SELECT p.name, p.surname, t.role
        FROM trimelis t
        JOIN professors p ON t.professor_id = p.professor_id
        WHERE t.themata_b_id = $themata_b_id
    ";
    $committee_result = $conn->query($committee_sql);
    $committee = [];

    while ($member = $committee_result->fetch_assoc()) {
        $committee[] = $member;
    }

    $row['committee'] = $committee;
    $completed[] = $row;
}

echo json_encode(['completed' => $completed]);
?>