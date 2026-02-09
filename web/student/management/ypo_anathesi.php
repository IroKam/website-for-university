<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../login/Login.html");
    exit();
}

$student_user_id = $_SESSION['user_id'];

// Βρες το student_id
$sql = "SELECT student_id FROM students WHERE user_id = $student_user_id";
$result = $conn->query($sql);
$student_row = $result->fetch_assoc();
$student_id = $student_row['student_id'];

// === GET ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = [];

    // Λήψη όλων των καθηγητών
    // Βρες τον επιβλέποντα για να τον αποκλείσεις
$supervisor_sql = "SELECT a.professor_id 
                   FROM themata_b AS b
                   INNER JOIN themata_a As a ON b.themata_a_id = a.themata_a_id 
                   WHERE b.student_id = $student_id AND b.status = 'Υπό Ανάθεση'";
$supervisor_result = $conn->query($supervisor_sql);
$supervisor_id = $supervisor_result->fetch_assoc()['professor_id'] ?? -1;

// Φέρε όλους τους καθηγητές εκτός από τον επιβλέποντα
$prof_sql = "SELECT professor_id, name, surname FROM professors WHERE professor_id != $supervisor_id";
    $prof_result = $conn->query($prof_sql);
    $professors = [];
    while ($row = $prof_result->fetch_assoc()) {
        $professors[] = $row;
    }

    // Λήψη θεμάτων του φοιτητή που είναι Υπό Ανάθεση
    $diploma_sql = "SELECT themata_b_id, title FROM themata_b 
                   INNER JOIN themata_a ON themata_b.themata_a_id = themata_a.themata_a_id
                   WHERE student_id = $student_id AND themata_b.status = 'Υπό Ανάθεση'";
    $diplo_result = $conn->query($diploma_sql);
    $diplomas = [];
    while ($row = $diplo_result->fetch_assoc()) {
        $diplomas[] = $row;
    }

    // Λήψη προσκλήσεων του φοιτητή
    $inv_sql = "SELECT i.*, p.name AS prof_name, p.surname AS prof_surname
                FROM invitations i 
                INNER JOIN professors p ON i.professor_id = p.professor_id
                WHERE i.student_id = $student_id";
    $inv_result = $conn->query($inv_sql);
    $invitations = [];
    while ($row = $inv_result->fetch_assoc()) {
        $invitations[] = $row;
    }

    echo json_encode([
        'professors' => $professors,
        'diplomas' => $diplomas,
        'invitations' => $invitations
    ]);
    exit();
}

// === POST === Πρόσκληση Καθηγητή ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'invite_professor') {
    $themata_b_id = intval($_POST['themata_b_id']);
    $professor_id = intval($_POST['professor_id']);

    // Έλεγχος αν υπάρχει ήδη ίδια πρόσκληση
    $check_sql = "SELECT * FROM invitations WHERE themata_b_id = $themata_b_id AND professor_id = $professor_id";
    $check_result = $conn->query($check_sql);
    if ($check_result->num_rows > 0) {
        echo "Υπάρχει ήδη πρόσκληση σε αυτόν τον καθηγητή.";
        exit();
    }

    // Εισαγωγή νέας πρόσκλησης
    $insert_sql = "INSERT INTO invitations (themata_b_id, student_id, professor_id, status) VALUES 
                    ($themata_b_id, $student_id, $professor_id, 'Ανοιχτή')";
    $conn->query($insert_sql);

    // Έλεγχος αν υπάρχουν ήδη 2 Αποδεκτές
    $count_sql = "SELECT COUNT(*) AS accepted_count FROM invitations 
                  WHERE themata_b_id = $themata_b_id AND status = 'Αποδεκτή'";
    $count_result = $conn->query($count_sql);
    $accepted = $count_result->fetch_assoc()['accepted_count'];

    if ($accepted >= 2) {
        // Ενημέρωση κατάστασης σε Ενεργή
        $conn->query("UPDATE themata_b SET status = 'Ενεργή' WHERE themata_b_id = $themata_b_id");

        // Ακύρωση υπολοίπων ανοιχτών προσκλήσεων
        $conn->query("UPDATE invitations SET status = 'Απορριφθείσα' 
                      WHERE themata_b_id = $themata_b_id AND status = 'Ανοιχτή'");
    }

    echo "Η πρόσκληση στάλθηκε με επιτυχία.";
    exit();
}
?>
