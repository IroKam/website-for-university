<?php
session_start();
include('../../db.php');

ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Δεν είστε συνδεδεμένος']);
    exit();
}

$student_user_id = $_SESSION['user_id'];

// Βρες το themata_b_id του φοιτητή που είναι Υπό Εξέταση
$sql = "SELECT themata_b_id FROM themata_b WHERE student_id = (
            SELECT student_id FROM students WHERE user_id = $student_user_id
        ) AND status = 'Υπό εξέταση'";

$result = $conn->query($sql);
if (!$result || $result->num_rows === 0) {
    echo json_encode(['error' => 'Δεν βρέθηκε διπλωματική υπό εξέταση']);
    exit();
}
$row = $result->fetch_assoc();
$themata_b_id = $row['themata_b_id'];

// === Ανέβασμα αρχείου ===
$target_dir = "../../uploads/proxeira/";
$uploaded_file_path = null;

if (isset($_FILES["file"]) && $_FILES["file"]["error"] === UPLOAD_ERR_OK) {
    $file_tmp = $_FILES["file"]["tmp_name"];
    $file_name = basename($_FILES["file"]["name"]);
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

    $allowed = ['pdf', 'docx', 'doc'];
    if (!in_array($file_ext, $allowed)) {
        echo json_encode(['error' => 'Επιτρέπονται μόνο αρχεία PDF ή Word']);
        exit();
    }

    $new_filename = uniqid() . "_" . $file_name;
    $target_file = $target_dir . $new_filename;

    if (!move_uploaded_file($file_tmp, $target_file)) {
        echo json_encode(['error' => 'Αποτυχία αποθήκευσης αρχείου']);
        exit();
    }

    $uploaded_file_path = "uploads/proxeira/" . $new_filename;
}

// === Σύνδεσμοι ===
$links = isset($_POST['links']) ? $conn->real_escape_string($_POST['links']) : null;

// === Ενημέρωση πίνακα ===
$update_sql = "UPDATE themata_b 
               SET 
                   proxeiro_file = " . ($uploaded_file_path ? "'$uploaded_file_path'" : "proxeiro_file") . ",
                   extra_links = " . ($links !== null ? "'$links'" : "extra_links") . ",
                   proxeiro_uploaded_at = NOW()
               WHERE themata_b_id = $themata_b_id";

if ($conn->query($update_sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Αποτυχία ενημέρωσης δεδομένων']);
}
?>