<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Μη εξουσιοδοτημένη πρόσβαση"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Εύρεση student_id
$sqlStudent = "SELECT student_id FROM students WHERE user_id = ?";
$stmtStudent = $conn->prepare($sqlStudent);
$stmtStudent->bind_param("i", $user_id);
$stmtStudent->execute();
$resultStudent = $stmtStudent->get_result();

if ($resultStudent->num_rows === 0) {
    echo json_encode([]);
    exit();
}

$student_id = $resultStudent->fetch_assoc()['student_id'];

// Ανάκτηση διπλωματικής
$sql = "SELECT b.themata_b_id, a.title, a.description, a.pdf_file AS attachment, b.status, b.start_date  
        FROM themata_b AS b
        INNER JOIN themata_a AS a ON b.themata_a_id = a.themata_a_id
        WHERE b.student_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([]);
    exit();
}

$thesis = $result->fetch_assoc();

// Εύρεση μελών τριμελούς επιτροπής
$thesis_id = $thesis['themata_b_id'];
$sqlCommittee = "SELECT p.name, p.surname, t.role 
                 FROM trimelis AS t
                 INNER JOIN professors AS p ON t.professor_id = p.professor_id
                 WHERE t.themata_b_id = ?";
$stmtC = $conn->prepare($sqlCommittee);
$stmtC->bind_param("i", $thesis_id);
$stmtC->execute();
$resultC = $stmtC->get_result();

$committee = [];
while ($row = $resultC->fetch_assoc()) {
    $committee[] = $row;
}

// Προσθήκη της επιτροπής στο αντικείμενο
$thesis['committee'] = $committee;
$thesis['filename'] = $thesis['attachment'];


echo json_encode([$thesis], JSON_UNESCAPED_UNICODE);
?>
