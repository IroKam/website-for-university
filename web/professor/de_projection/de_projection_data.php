<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

$id = "SELECT professor_id FROM professors WHERE user_id=$user_id";
$residResult = $conn->query($id);
$resid = $residResult->fetch_assoc()['professor_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $statusFilter = isset($_GET['status']) ? $_GET['status'] : '';
    $roleFilter = isset($_GET['role']) ? $_GET['role'] : '';

    $sql = "SELECT t.role, p.user_id, p.name AS professor_name, p.surname AS professor_surname, 
       b.themata_a_id, b.student_id, b.status, b.start_date, b.end_date, 
       b.date_en, b.date_yexams, b.grade,
       a.title, s.student_id AS student_id, s.name AS student_name, s.surname AS student_surname
        FROM trimelis AS t 
        INNER JOIN professors AS p ON t.professor_id = p.professor_id 
        INNER JOIN themata_b AS b ON t.themata_b_id = b.themata_b_id 
        INNER JOIN themata_a AS a ON b.themata_a_id = a.themata_a_id 
        INNER JOIN students AS s ON b.student_id = s.student_id 
        WHERE p.user_id = $user_id";

    if (!empty($statusFilter)) {
        $statusFilter = $conn->real_escape_string($statusFilter);
        $sql .= " AND b.status = '$statusFilter'";
    }
    
    if (!empty($roleFilter)) {
        $roleFilter = $conn->real_escape_string($roleFilter);
        $sql .= " AND t.role = '$roleFilter'";
    }

    $sql .= " ORDER BY b.start_date DESC";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode([]); 
    }
}

?>
