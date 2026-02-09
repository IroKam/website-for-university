<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id="SELECT professor_id FROM professors WHERE user_id=$user_id";
            $residResult = $conn->query($id);
            $resid = $residResult->fetch_assoc()['professor_id'];


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
$sql = "SELECT title, description, pdf_file, themata_a_id FROM themata_a WHERE professor_id = $resid AND themata_a_id NOT IN (
    SELECT themata_a_id FROM themata_b ) ORDER BY creation_date DESC;"; 
$themataProjection = $conn->query($sql);

if ($themataProjection->num_rows > 0) {
    // Αποθήκευση δεδομένων σε πίνακα
    $themata = [];
    while ($row = $themataProjection->fetch_assoc()) {
        $themata[] = $row; 
    }
    // Επιστροφή JSON απόκρισης
    echo json_encode($themata);
} else {
    echo json_encode([]); 
}
}
// Διαγραφή 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
if($_POST['action'] == 'deleteRecord'){
    $id = $_POST['id'];

    $query = "DELETE FROM themata_a WHERE themata_a_id='$id'";
    $query = $conn -> query($query);
    if($query){
        echo "Το θέματα διαγράφτηκε με επιτυχία.";
    } else{
        echo "Αποτυχία διαγραφής";
    }
}
}
?>