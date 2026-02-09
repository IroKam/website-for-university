<?php
session_start();
include('../../db.php');

// Ενεργοποίηση σφαλμάτων για εντοπισμό (προσωρινά)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user_id'])) {
    echo "Δεν έχει γίνει σύνδεση χρήστη.";
    exit();
}

$student_user_id = $_SESSION['user_id'];

// Σύνδεση βάσης δεδομένων
if (!$conn) {
    die("Σφάλμα σύνδεσης βάσης: " . mysqli_connect_error());
}

// Βρες το student_id
$sql = "SELECT student_id FROM students WHERE user_id = $student_user_id";
$result = $conn->query($sql);
if (!$result) {
    die("Σφάλμα SQL 1: " . $conn->error);
}
$row = $result->fetch_assoc();
if (!$row) {
    die("Ο φοιτητής δεν βρέθηκε");
}
$student_id = $row['student_id'];

// Φέρε ενεργές διπλωματικές
$sql = "
    SELECT tb.themata_b_id, ta.title, 
       IFNULL(DATEDIFF(CURDATE(), tb.start_date), 0) AS days_active
FROM themata_b tb
JOIN themata_a ta ON tb.themata_a_id = ta.themata_a_id
WHERE tb.student_id = $student_id AND tb.status = 'Ενεργή'

";
$result = $conn->query($sql);
if (!$result) {
    die("Σφάλμα SQL 2: " . $conn->error);
}

$active = [];

while ($row = $result->fetch_assoc()) {
    $themata_b_id = $row['themata_b_id'];

    // Τριμελής
    $trimelis_sql = "
        SELECT p.name, p.surname, t.role 
        FROM trimelis t
        JOIN professors p ON t.professor_id = p.professor_id
        WHERE t.themata_b_id = $themata_b_id
    ";
    $trimelis_result = $conn->query($trimelis_sql);
    if (!$trimelis_result) {
        die("Σφάλμα SQL 3 (trimelis): " . $conn->error);
    }

    $committee = [];
    while ($member = $trimelis_result->fetch_assoc()) {
        $committee[] = $member;
    }

    $row['committee'] = $committee;
    $active[] = $row;
}

// Απάντηση JSON
echo json_encode(['active' => $active]);
?>