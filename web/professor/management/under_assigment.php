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

//Υπο Ανάθεση
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $sql = "SELECT a.title,b.student_id, b.start_date,s.name, s.surname, b.start_date, p2.name as professor_name, p2.surname as professor_surname, i.sent_date, i.response_date, i.status, b.themata_b_id
                        FROM themata_b as b INNER JOIN themata_a as a ON b.themata_a_id = a.themata_a_id
                        INNER JOIN professors as p1 on a.professor_id=p1.professor_id
                        LEFT JOIN invitations AS i ON b.themata_b_id = i.themata_b_id
            			LEFT JOIN professors AS p2 ON i.professor_id = p2.professor_id
                        INNER JOIN students as s on b.student_id=s.student_id
                        WHERE a.professor_id = $resid AND b.status='Υπό Ανάθεση' ";
                $result = $conn->query($sql);

                $data = [];
                while ($row = $result->fetch_assoc()) {
                    $title = $row['title'];
                    if (!isset($data[$title])) {
                        $data[$title] = [
                            'title' => $title,
                            'student_name' => $row['name'],
                            'student_surname' => $row['surname'],
                            'student_id'=> $row['student_id'],
                            'start_date'=>$row['start_date'],
                            'themata_b_id'=>$row['themata_b_id'],
                            'professors' => []
                        ];
                    }
                    $data[$title]['professors'][] = [
                        'name' => $row['professor_name'] . ' ' . $row['professor_surname'],
                        'sent_date' => $row['sent_date'],
                        'response_date' => $row['response_date'],
                        'status' => $row['status']
                    ];
                }

                // Μετατροπή σε JSON
                echo json_encode(array_values($data));
            }

            // Διαγραφή 
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
                if($_POST['action'] == 'cancelRecord'){
                    $id = $_POST['id'];
                
                    $query1 = "DELETE FROM themata_b WHERE themata_b_id='$id'";
                    $query = $conn -> query($query1);

                    $query2 = "DELETE FROM invitations WHERE themata_b_id='$id'";
                    $query = $conn -> query($query2);
                    if($query){
                        echo "Η ανάθεση διαγράφτηκε με επιτυχία.";
                    } else{
                        echo "Αποτυχία διαγραφής";
                    }
                }
                }
?>