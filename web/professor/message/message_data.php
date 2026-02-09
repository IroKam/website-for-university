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
                $sql = "SELECT i.sent_date, i.invitation_id ,i.student_id, a.title, p.name as professor_name, p.surname as professor_surname, b.start_date, s.name as student_name, s.surname as student_surname, b.themata_b_id
                        FROM invitations as i INNER JOIN themata_b as b ON i.themata_b_id=b.themata_b_id
                        INNER JOIN themata_a as a ON b.themata_a_id= a.themata_a_id
                        INNER JOIN students as s ON i.student_id = s.student_id
                        INNER JOIN professors as p ON a.professor_id = p.professor_id
                        where i.professor_id = $resid AND i.status = 'Ανοιχτή' ORDER BY creation_date DESC"; 
                $messageProjection = $conn->query($sql);
                
                if ($messageProjection->num_rows > 0) {
                    // Αποθήκευση δεδομένων σε πίνακα
                    $message = [];
                    while ($row = $messageProjection->fetch_assoc()) {
                        $message[] = $row; 
                    }
                    // Επιστροφή JSON απόκρισης
                    echo json_encode($message);
                } else {
                    echo json_encode([]); 
                }
                }
                
                //Αποδοχή
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
                    if($_POST['action'] == 'acceptInvitation'){
                        $accept_id = $_POST['invitation_id'];
                        $themata_b_id = $_POST['themata_b_id'];
                    
                        $query = "UPDATE invitations SET status = 'Αποδεκτή', response_date = CURRENT_TIMESTAMP WHERE invitation_id= $accept_id";
                        $query = $conn -> query($query);

                        if ($query) {
                            $insertQuery = "INSERT INTO trimelis (themata_b_id, professor_id, role) VALUES ($themata_b_id, $resid, 'Μέλος Τριμελούς')";
                            $insertResult = $conn->query($insertQuery);
                            
                        if($insertResult){
                            echo "Το μήνυμα αποδέκτηκε.";
                        } else{
                            echo "Αποτυχία απόρριψης";
                        }
                    }
                    }
                }

                //Απόρριψη
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
                    if($_POST['action'] == 'rejectionInvitation'){
                        $rejection_id = $_POST['id'];
                    
                        $query = "UPDATE invitations 
                                    SET status = 'Απορριφθείσα', response_date = CURRENT_TIMESTAMP 
                                    WHERE invitation_id = $rejection_id;";
                        $query = $conn -> query($query);
                        if($query){
                            echo "Το μήνυμα απορριφθήκε.";
                        } else{
                            echo "Αποτυχία αποδοχής";
                        }
                    }
                    }

?> 