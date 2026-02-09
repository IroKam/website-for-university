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


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $student_id = $_POST['student_id'];
    $themata_a_id = $_POST['themata_a_id'];
    $start_date = date('Y-m-d'); 

    
    $conn->begin_transaction();

    try {
        
        $query_themata_b = $conn->prepare("INSERT INTO themata_b (student_id, themata_a_id, start_date) VALUES (?, ?, ?)");
        $query_themata_b->bind_param('iis', $student_id, $themata_a_id, $start_date);

        if (!$query_themata_b->execute()) {
            throw new Exception("Σφάλμα κατά την εισαγωγή στον πίνακα themata_b: " . $query_themata_b->error);
        }

        
        $themata_b_id = $conn->insert_id;

        // Εισάγουμε δεδομένα στον πίνακα trimelis
        $professor_id = $resid; 
        $role = 'Επιβλέπων'; 

        $query_trimelis = $conn->prepare("INSERT INTO trimelis (themata_b_id, professor_id, role) VALUES (?, ?, ?)");
        $query_trimelis->bind_param('iis', $themata_b_id, $professor_id, $role);

        if (!$query_trimelis->execute()) {
            throw new Exception("Σφάλμα κατά την εισαγωγή στον πίνακα trimelis: " . $query_trimelis->error);
        }

        // Εισάγεται κενό στο βαθμό 

        $query_grade = $conn->prepare("INSERT INTO grades (themata_b_id, professor_id) VALUES (?, ?)");
        $query_grade->bind_param('ii', $themata_b_id, $professor_id);

        if (!$query_grade->execute()) {
            throw new Exception("Σφάλμα κατά την εισαγωγή στον πίνακα grades: " . $query_grade->error);
        }
       

        
        $conn->commit();

        echo json_encode(['success' => true, 'message' => 'Επιτυχής καταχώρηση!']);
    } catch (Exception $e) {
        
        $conn->rollback();

        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }

    
    $query_themata_b->close();
    $query_trimelis->close();
    $conn->close();
    exit();
}



if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $search = $_GET['search'];
    $type = $_GET['type']; 

    if ($type === 'id') {
        $query = $conn->prepare("SELECT s.student_id, s.name, s.surname FROM students s WHERE s.student_id NOT IN (
    SELECT t.student_id FROM themata_b t) AND s.student_id LIKE ? LIMIT 10;");
        $likeSearch = '%' . $search . '%';
        $query->bind_param('s', $likeSearch);
    } elseif ($type === 'name') {
        $query = $conn->prepare("SELECT s.student_id, s.name, s.surname FROM students s WHERE s.student_id NOT IN (
    SELECT t.student_id FROM themata_b t ) AND (s.name LIKE ? OR s.surname LIKE ?) LIMIT 10;");
        $likeSearch = '%' . $search . '%';
        $query->bind_param('ss', $likeSearch, $likeSearch);
    } elseif ($type === 'title') {
        $query = $conn->prepare("SELECT a.themata_a_id, a.title FROM themata_a AS a WHERE a.status = 'open' AND a.themata_a_id NOT IN (
    SELECT b.themata_a_id FROM themata_b AS b) AND a.title LIKE ? LIMIT 10;");
        $likeSearch = '%' . $search . '%';
        $query->bind_param('s', $likeSearch);
        
    }

    $query->execute();
    $result = $query->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        if ($type === 'id' || $type === 'name') {
            $data[] = [
                'id' => $row['student_id'],
                'name' => $row['name'],
                'surname' => $row['surname']
            ];
        } elseif ($type === 'title') {
            $data[] = [
                'themata_a_id' => $row['themata_a_id'],
                'title' => $row['title']
                
            ];
        }
    }

    echo json_encode($data);

    $query->close();
    $conn->close();
}
?>
