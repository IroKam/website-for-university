<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id="SELECT grammatia_id FROM grammatia WHERE user_id=$user_id";
            $residResult = $conn->query($id);
            $resid = $residResult->fetch_assoc()['grammatia_id'];

// Εκτέλεση ερωτήματος για ανάκτηση θεμάτων από τον πίνακα themata_a
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
$sql = "SELECT themata_a.title, themata_a.themata_a_id FROM themata_a 
INNER JOIN themata_b ON themata_a.themata_a_id = themata_b.themata_a_id 
WHERE themata_b.status = 'Υπό Εξέταση' OR themata_b.status = 'Ενεργή' 
ORDER BY creation_date DESC;"; 
$themataResult = $conn->query($sql);

if ($themataResult->num_rows > 0) {
    // Αποθήκευση δεδομένων σε πίνακα
    $themata = [];
    while ($row = $themataResult->fetch_assoc()) {
        $themata[] = $row; // Κάθε γραμμή περιέχει τους τίτλους
    }
    // Επιστροφή JSON απάντησης
    echo json_encode($themata);
} else {
    echo json_encode([]); // Επιστροφή κενής λίστας αν δεν υπάρχουν δεδομένα
}
}
?>