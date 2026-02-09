<?php
session_start();
include('../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id="SELECT professor_id FROM professors WHERE user_id=$user_id";
            $residResult = $conn->query($id);
            $resid = $residResult->fetch_assoc()['professor_id'];

$sql = "SELECT announce FROM announce ORDER BY create_date DESC";
$result = $conn->query($sql);

$announcements = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }
}

echo json_encode($announcements);

$conn->close();
?>
