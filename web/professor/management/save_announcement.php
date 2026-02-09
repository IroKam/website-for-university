<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    echo "Μη εξουσιοδοτημένη πρόσβαση.";
    exit();
}

$user_id = $_SESSION['user_id'];
$themata_b_id = $_POST['themata_b_id'] ?? null;
$announce = $_POST['announce'] ?? null;

if (!$themata_b_id || !$announce) {
    echo "Λείπουν δεδομένα.";
    exit();
}

$stmt = $conn->prepare("SELECT professor_id FROM professors WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
$professor_id = $res->fetch_assoc()['professor_id'] ?? null;

if (!$professor_id) {
    echo "Σφάλμα χρήστη.";
    exit();
}

// Αποθήκευση ή Αντικατάσταση
$stmt = $conn->prepare("
    INSERT INTO announce (themata_b_id, professor_id, announce)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE announce = VALUES(announce), create_date = CURRENT_TIMESTAMP
");
$stmt->bind_param("iis", $themata_b_id, $professor_id, $announce);

echo $stmt->execute() ? "Η ανακοίνωση αποθηκεύτηκε." : "Σφάλμα κατά την αποθήκευση.";
?>
