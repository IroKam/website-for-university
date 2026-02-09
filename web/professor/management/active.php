<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

// professor_id 
$residQuery = $conn->prepare("SELECT professor_id FROM professors WHERE user_id=?");
$residQuery->bind_param("i", $user_id);
$residQuery->execute();
$residResult = $residQuery->get_result();
$resid = $residResult->fetch_assoc()['professor_id'];

// POST: Αποθήκευση νέας σημείωσης 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'addNote') {
    $themata_b_id = $_POST['themata_b_id'];
    $note = substr($_POST['note'], 0, 300);

    $stmt = $conn->prepare("INSERT INTO professor_notes (professor_id, themata_b_id, note) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $resid, $themata_b_id, $note);

    echo $stmt->execute() ? "Η σημείωση αποθηκεύτηκε." : "Σφάλμα κατά την αποθήκευση.";
    exit();
}

// GET: Ανάκτηση σημειώσεων
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getNotes') {
    $themata_b_id = $_GET['themata_b_id'];

    $stmt = $conn->prepare("SELECT note_id, note, created_at FROM professor_notes WHERE professor_id = ? AND themata_b_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("ii", $resid, $themata_b_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }

    echo json_encode($notes);
    exit();
}

// POST: Διαγραφή σημείωσης 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deleteNote') {
    $note_id = $_POST['note_id'];

    $stmt = $conn->prepare("DELETE FROM professor_notes WHERE note_id = ? AND professor_id = ?");
    $stmt->bind_param("ii", $note_id, $resid);

    echo $stmt->execute() ? "Η σημείωση διαγράφηκε." : "Σφάλμα κατά τη διαγραφή.";
    exit();
}

// POST: Ακύρωση ανάθεσης από επιβλέποντα 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'cancelAssignmentByProfessor') {
    $themata_b_id = $_POST['themata_b_id'];
    $cancel_number = $_POST['cancel_number'];
    $year = $_POST['year'];
    $reason = 'από Διδάσκοντα';

    // Επιβεβαιώνουμε ότι ο χρήστης είναι επιβλέπων
    $stmt = $conn->prepare("SELECT * FROM trimelis WHERE professor_id = ? AND themata_b_id = ? AND role = 'Επιβλέπων'");
    $stmt->bind_param("ii", $resid, $themata_b_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo "Δεν είστε επιβλέπων σε αυτή τη διπλωματική.";
        exit();
    }

    //  Έλεγχος αν έχουν περάσει 2 έτη από την έναρξη
    $stmt = $conn->prepare("SELECT start_date FROM themata_b WHERE themata_b_id = ?");
    $stmt->bind_param("i", $themata_b_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $start_date = $res->fetch_assoc()['start_date'];

    if (strtotime($start_date) > strtotime('-2 years')) {
        echo "Δεν έχουν περάσει 2 έτη από την ημερομηνία ανάθεσης.";
        exit();
    }

    //  Καταχώρηση ακύρωσης στον πίνακα cancel
    $stmt = $conn->prepare("INSERT INTO cancel (themata_b_id, cancel_reason, cancel_number, year) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issi", $themata_b_id, $reason, $cancel_number, $year);
    $stmt->execute();

    //  Ενημέρωση της κατάστασης και της ημερομηνίας λήξης
    $stmt = $conn->prepare("UPDATE themata_b SET status = 'Ακυρωμένη', end_date = CURDATE() WHERE themata_b_id = ?");
    $stmt->bind_param("i", $themata_b_id);
    $stmt->execute();

    echo "Η ανάθεση ακυρώθηκε επιτυχώς.";
    exit();
}

//  GET: Λήψη ενεργών διπλωματικών
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT a.title, s.student_id , s.name as student_name, s.surname as student_surname, 
                   p.name as professor_name, p.surname as professor_surname, t.role , b.start_date, b.themata_b_id
            FROM themata_a as a 
            LEFT JOIN themata_b as b ON a.themata_a_id = b.themata_a_id
            LEFT JOIN trimelis as t ON t.themata_b_id = b.themata_b_id
            LEFT JOIN professors as p ON t.professor_id = p.professor_id
            LEFT JOIN students as s ON b.student_id = s.student_id 
            WHERE b.status = 'Ενεργή' 
              AND b.themata_b_id IN (
                SELECT b1.themata_b_id
                FROM themata_b as b1 
                INNER JOIN trimelis as t1 ON b1.themata_b_id = t1.themata_b_id
                WHERE t1.professor_id = $resid
              );";

    $result = $conn->query($sql);

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $title = $row['title'];
        if (!isset($data[$title])) {
            $data[$title] = [
                'title' => $title,
                'student_name' => $row['student_name'],
                'student_surname' => $row['student_surname'],
                'student_id' => $row['student_id'],
                'start_date' => $row['start_date'],
                'themata_b_id' => $row['themata_b_id'],
                'professors' => []
            ];
        }

        $data[$title]['professors'][] = [
            'name' => $row['professor_name'] . ' ' . $row['professor_surname'],
            'role' => $row['role'],
        ];
    }

    echo json_encode(array_values($data));
}

//  POST: Ενημέρωση σε Υπό Εξέταση από επιβλέποντα 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'markAsUnderReview') {
    $themata_b_id = $_POST['themata_b_id'];

    //  Επιβεβαιώνουμε ότι ο χρήστης είναι επιβλέπων
    $stmt = $conn->prepare("SELECT * FROM trimelis WHERE professor_id = ? AND themata_b_id = ? AND role = 'Επιβλέπων'");
    $stmt->bind_param("ii", $resid, $themata_b_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo "Δεν έχετε δικαίωμα να αλλάξετε την κατάσταση.";
        exit();
    }

    //  Ενημέρωση κατάστασης
    $stmt = $conn->prepare("UPDATE themata_b SET status = 'Υπό Εξέταση', date_yexams = NOW() WHERE themata_b_id = ?");
    $stmt->bind_param("i", $themata_b_id);
    $stmt->execute();

    echo "Η κατάσταση άλλαξε σε 'Υπό Εξέταση'.";
    exit();
}
?>
