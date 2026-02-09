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

// διαχείριση θεματος            
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    
    if ($action === 'save_ap') {
        $thema_id = $_POST['thema_id'];
        $ap = $_POST['ap'];
        
        //ευρεση themata_b_id
        $sql = "SELECT themata_b_id FROM themata_b WHERE themata_a_id = $thema_id";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $themata_b_id = $row['themata_b_id'];
        
        //αποθηκευση ap
        $sql = "UPDATE themata_b SET ap_gs = '$ap' WHERE themata_b_id = $themata_b_id";
        if ($conn->query($sql)) {
            echo json_encode([
                "success" => true,
                "message" => "Ο ΑΠ αποθηκεύτηκε!"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Σφάλμα: " . $conn->error
            ]);
        }
        exit;
    }

    if ($action === 'cancel') {
    $thema_id = $_POST['thema_id'];
    $gs_number = $_POST['gs_number'];
    $gs_year = $_POST['gs_year'];
    $reason = $_POST['reason'];

    // Εύρεση themata_b_id
    $sql = "SELECT themata_b_id FROM themata_b WHERE themata_a_id = $thema_id";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $themata_b_id = $row['themata_b_id'];

    // Αποθήκευση ακύρωσης
    $sql1 = "INSERT INTO cancel (themata_b_id, cancel_number, year, cancel_reason) VALUES ($themata_b_id, '$gs_number', '$gs_year', '$reason')";
    $ok1 = $conn->query($sql1);

    // Ακύρωση ανάθεσης
    $sql2 = "UPDATE themata_b SET status = 'Ακυρωμένη' WHERE themata_b_id = $themata_b_id";
    $ok2 = $conn->query($sql2);

    if ($ok1 && $ok2) {
         echo json_encode([
                "success" => true,
                "message" => "Η ακύρωση ολοκληρώθηκε!"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Σφάλμα: " . $conn->error
            ]);
        }
    exit;
    }

    if ($action === 'save_exam_report') {
        $thema_id = $_POST['thema_id'];
        $report_html = $_POST['report_html'];

        // Εύρεση themata_b_id
        $sql = "SELECT themata_b_id FROM themata_b WHERE themata_a_id = $thema_id";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $themata_b_id = $row['themata_b_id'];
        
        // αποθηκευση πρακτικου εξετασης
        $sql = "UPDATE themata_b SET paper = '$report_html' WHERE themata_b_id = $themata_b_id";
        if ($conn->query($sql)) {
            echo json_encode([
                "success" => true,
                "message" => "Το πρακτικό αποθηκεύτηκε!"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Σφάλμα: " . $conn->error
            ]);
        }
        exit;
    }

    if ($action ==='to_finished') {
       $thema_id = $_POST['thema_id'];

        //ελεγχος υπαρξης βαθμου, συνδεσμου και πρακτικου εξετασης
        $sql = "SELECT grade, link, paper FROM themata_b WHERE themata_a_id = $thema_id";
        $result = $conn->query($sql);
        if (!$result || !$row = $result->fetch_assoc()) {
        echo json_encode([
            "success" => false,
            "message" => "Δεν βρέθηκε το θέμα!"
        ]);
        exit;
        }
        
        //ελεγχος
        if (empty($row['grade']) || empty($row['link']) || empty($row['paper'])) {
        echo json_encode([
            "success" => false,
            "message" => "Δεν έχουν συμπληρωθεί όλα τα απαραίτητα πεδία."
        ]);
        exit;
    }
        // Εύρεση themata_b_id
        $sql = "SELECT themata_b_id FROM themata_b WHERE themata_a_id = $thema_id";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $themata_b_id = $row['themata_b_id'];
        
        // αλλαγη σε περατωμένη
        $sql = "UPDATE themata_b SET status = 'Περατωμένη' WHERE themata_b_id = $themata_b_id";
        if ($conn->query($sql)) {
            echo json_encode([
                "success" => true,
                "message" => "Η κατάσταση της διπλωματικής άλλαξε σε Περατωμένη!"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Σφάλμα: " . $conn->error
            ]);
        }
        exit;
    }
}
?>
