<?php
session_start();
include('../../db.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id="SELECT grammatia_id FROM grammatia WHERE user_id=$user_id";
            $residResult = $conn->query($id);
            $resid = $residResult->fetch_assoc()['grammatia_id'];

// Λήψη της μεταβλητής από το AJAX αίτημα
$themata_a_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
if ($themata_a_id === 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit();
}

$sql = "SELECT themata_a.themata_a_id, themata_a.title, themata_a.description, themata_b.status, themata_b.start_date, professors.name, professors.surname, trimelis.role 
FROM themata_a
INNER JOIN themata_b ON themata_a.themata_a_id = themata_b.themata_a_id
INNER JOIN trimelis ON themata_b.themata_b_id = trimelis.themata_b_id
INNER JOIN professors ON trimelis.professor_id = professors.professor_id
WHERE themata_a.themata_a_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $themata_a_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Επιστροφή JSON απόκρισης
    echo json_encode($data,JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]); // Επιστροφή κενής λίστας αν δεν υπάρχουν δεδομένα
}
?>