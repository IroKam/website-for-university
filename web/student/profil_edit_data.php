<?php
session_start();
include('../db.php');

// Έλεγχος αν ο χρήστης έχει συνδεθεί
if (!isset($_SESSION['user_id'])) {
    echo "Δεν υπάρχει σύνδεση χρήστη.";
    exit();
}

$user_id = $_SESSION['user_id'];

// Βρες το student_id του χρήστη
$query = "SELECT student_id FROM students WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "Δεν βρέθηκε φοιτητής για τον χρήστη.";
    exit();
}

$student_id = $result->fetch_assoc()['student_id'];
$stmt->close();

// Λήψη δεδομένων από AJAX
$email = $_POST['email'] ?? null;
$phone = $_POST['phone'] ?? null;
$phone_home = $_POST['phone_home'] ?? null;
$adress = $_POST['adress'] ?? null;
$city = $_POST['city'] ?? null;
$tk = $_POST['tk'] ?? null;

if (!$email || !$phone || !$phone_home) {
    echo "Λείπουν δεδομένα.";
    exit();
}

// Ενημέρωση πίνακα users (για email)
$stmt1 = $conn->prepare("UPDATE users SET email = ? WHERE user_id = ?");
$stmt1->bind_param("si", $email, $user_id);

// Ενημέρωση πίνακα students (για τηλέφωνα)
$stmt2 = $conn->prepare("UPDATE students SET phone = ?, home_phone = ?, adress = ?, city = ?, tk = ? WHERE student_id = ?");
$stmt2->bind_param("sssssi", $phone, $home_phone, $adress, $city, $tk, $student_id);


if ($stmt1->execute() && $stmt2->execute()) {
    echo "Επιτυχής ενημέρωση.";
} else {
    echo "Σφάλμα: " . $stmt1->error . " / " . $stmt2->error;
}

$stmt1->close();
$stmt2->close();
$conn->close();
?>
