<?php
session_start();
include('../../db.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

// === professor_id  ===
$stmt = $conn->prepare("SELECT professor_id FROM professors WHERE user_id=?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$residResult = $stmt->get_result();
$resid = $residResult->fetch_assoc()['professor_id'];

// === Καταχώρηση βαθμολογίας ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'submit_grade') {
    $themata_b_id = intval($_POST['themata_b_id']);
$quality_targets = floatval($_POST['quality_targets']);
$duration = floatval($_POST['duration']);
$deliverables_quality = floatval($_POST['deliverables_quality']);
$presentation = floatval($_POST['presentation']);
$comments = isset($_POST['comments']) ? trim($_POST['comments']) : null;


    $stmt = $conn->prepare("INSERT INTO grades 
(themata_b_id, professor_id, quality_targets, duration, deliverables_quality, presentation, comments, grade, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
ON DUPLICATE KEY UPDATE
    quality_targets = VALUES(quality_targets),
    duration = VALUES(duration),
    deliverables_quality = VALUES(deliverables_quality),
    presentation = VALUES(presentation),
    comments = VALUES(comments),
    grade = VALUES(grade),
    created_at = NOW()");


if (!$stmt) {
    echo "Prepare failed: " . $conn->error;
    exit();
}

$grade = round(
    $quality_targets * 0.6 +
    $duration * 0.15 +
    $deliverables_quality * 0.15 +
    $presentation * 0.1,
2);

$stmt->bind_param("iiddddsd", $themata_b_id, $resid, $quality_targets, $duration, $deliverables_quality, $presentation, $comments, $grade);


if (!$stmt->execute()) {
    echo "Execution failed: " . $stmt->error;
    exit();
}



echo "Η βαθμολογία υποβλήθηκε.";
exit();

}

// === Βαθμοί όλων των μελών ===
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_grades') {
    $themata_b_id = $_GET['themata_b_id'];

    $stmt = $conn->prepare("
        SELECT g.*, p.name, p.surname
        FROM grades g
        JOIN professors p ON g.professor_id = p.professor_id
        WHERE g.themata_b_id = ?
    ");
    $stmt->bind_param("i", $themata_b_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $grades = [];
    while ($row = $result->fetch_assoc()) {
        $grades[] = $row;
    }

    echo json_encode($grades);
    exit();
}

// === Ενεργοποίηση βαθμολόγησης ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'enable_grading') {
    $themata_b_id = $_POST['themata_b_id'];

    // Έλεγχος ρόλου επιβλέποντα
    $stmt = $conn->prepare("SELECT * FROM trimelis WHERE themata_b_id = ? AND professor_id = ? AND role = 'Επιβλέπων'");
    $stmt->bind_param("ii", $themata_b_id, $resid);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo "Δεν έχετε δικαίωμα.";
        exit();
    }

    $stmt = $conn->prepare("UPDATE themata_b SET allow_grading = 1 WHERE themata_b_id = ?");
    $stmt->bind_param("i", $themata_b_id);
    $stmt->execute();

    echo "Η βαθμολόγηση ενεργοποιήθηκε.";
    exit();
}

// === Προβολή διπλωματικών "Υπό Εξέταση" ===
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['action'])) {
    $sql = "SELECT a.title, s.student_id, s.name as student_name, s.surname as student_surname, 
       p.name as professor_name, p.surname as professor_surname, t.role,
       b.start_date, b.themata_b_id, b.proxeiro_file, b.allow_grading, b.extra_links,
       ei.exam_datetime, ei.method, ei.details
FROM themata_a as a 
LEFT JOIN themata_b as b ON a.themata_a_id = b.themata_a_id
LEFT JOIN trimelis as t ON t.themata_b_id = b.themata_b_id
LEFT JOIN professors as p ON t.professor_id = p.professor_id
LEFT JOIN students as s ON b.student_id = s.student_id 
LEFT JOIN exetasi_info as ei ON ei.themata_b_id = b.themata_b_id
WHERE b.status = 'Υπό Εξέταση' 
  AND b.themata_b_id IN (
    SELECT b1.themata_b_id
    FROM themata_b as b1 
    INNER JOIN trimelis as t1 ON b1.themata_b_id = t1.themata_b_id
    WHERE t1.professor_id = ?
  );";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $resid);
    $stmt->execute();
    $result = $stmt->get_result();

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
                'proxeiro_file' => $row['proxeiro_file'],
                'allow_grading' => $row['allow_grading'],
                'extra_links' => $row['extra_links'],
                'exam_datetime' => $row['exam_datetime'],
                'method' => $row['method'],
                'details' => $row['details'],
                'professors' => []
            ];
        }

        $data[$title]['professors'][] = [
            'name' => $row['professor_name'] . ' ' . $row['professor_surname'],
            'role' => $row['role'],
        ];
    }

    echo json_encode(array_values($data));
    exit();
}
?>
