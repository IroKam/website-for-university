<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: ../../login/Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

// professor_id
$stmt = $conn->prepare("SELECT professor_id FROM professors WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
$professor_id = $res->fetch_assoc()['professor_id'];

// Ανάκτηση διπλωματικών με status Περατωμένη όπου ο καθηγητής συμμετέχει
$sql = "
SELECT a.title, s.student_id, s.name as student_name, s.surname as student_surname,
       b.start_date, b.themata_b_id, b.grade, b.link, b.paper
FROM themata_b as b
INNER JOIN themata_a as a ON a.themata_a_id = b.themata_a_id
LEFT JOIN students as s ON b.student_id = s.student_id
WHERE b.status = 'Περατωμένη'
  AND b.themata_b_id IN (
    SELECT themata_b_id FROM trimelis WHERE professor_id = ?
)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $professor_id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $themata_b_id = $row['themata_b_id'];

    // Ανάκτηση καθηγητών
    $stmt2 = $conn->prepare("
        SELECT p.name, p.surname, t.role
        FROM trimelis t
        JOIN professors p ON t.professor_id = p.professor_id
        WHERE t.themata_b_id = ?
    ");
    $stmt2->bind_param("i", $themata_b_id);
    $stmt2->execute();
    $res2 = $stmt2->get_result();

    $professors = [];
    while ($prof = $res2->fetch_assoc()) {
        $professors[] = [
            'name' => $prof['name'] . ' ' . $prof['surname'],
            'role' => $prof['role']
        ];
    }

    $data[] = array_merge($row, ['professors' => $professors]);
}

echo json_encode($data);
exit();
?>
