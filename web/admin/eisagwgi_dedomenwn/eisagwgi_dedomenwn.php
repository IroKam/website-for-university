<?php
session_start();
include('../../db.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

 $user_id = $_SESSION['user_id'];

$id="SELECT grammatia_id FROM grammatia WHERE user_id=$user_id";
    $residResult = $conn->query($id);
     $resid = $residResult->fetch_assoc()['grammatia_id'];

     
     // Εξασφαλίζουμε ότι το αρχείο είναι JSON
     if (isset($_FILES['jsonFile'])) {
         $fileTmpPath = $_FILES['jsonFile']['tmp_name'];
     
         // Ανάγνωση του περιεχομένου του JSON 
         $jsonData = file_get_contents($fileTmpPath);
         
         // Αποκωδικοποιηση του JSON
         $data = json_decode($jsonData, true);
         
         if (isset($data['students'])) {
             // Εισαγωγή δεδομένων για φοιτητή
             foreach ($data['students'] as $student) {
                 $student_id = $student['id'] ?? '';
                 $student_name = $student['name'] ?? '';
                 $student_surname = $student['surname'] ?? '';
                 $student_father_name = $student['father_name'] ?? '';
                 $student_etos_eisag = $student['etos_eisag'] ?? '';
                 $student_phone = $student['mobile_telephone'] ?? '';
                 $student_home_phone = $student['landline_telephone'] ?? '';
                 $student_address = $student['street'] ?? '';
                 $student_city = $student['city'] ?? '';
                 $student_tk = $student['postcode'] ?? '';
                 $student_email = $student['email'] ?? '';
                 $student_password = $student['password'] ?? '';
                 $student_role = 'Φοιτητής';
                
                // Έλεγχος για κενό email
                if (empty($student_email)) {
                  echo "Ο φοιτητής " . $student_name." ". $student_surname ." δεν έχει email. Παράληψη.\n ";
                  continue;
                }

                // Έλεγχος για διπλό email
                $check_email = "SELECT user_id FROM users WHERE email = '$student_email'";
                $result = $conn->query($check_email);
                if ($result && $result->num_rows > 0) {
                   echo "Το email $student_email του φοιτητή " . $student_name." ". $student_surname ." υπάρχει ήδη. Παράληψη.\n ";
                   continue;
                }

                // Έλεγχος για κενό password
                if (empty($student_password)) {
                  echo "Ο φοιτητής " . $student_name." ". $student_surname ." δεν έχει password. Παράληψη.\n ";
                  continue;
                }
                // SQL για την εισαγωγή των δεδομένων στον πινακα users
                $users_sql = "INSERT INTO users (email, password, role) VALUES ('$student_email', '$student_password', '$student_role')";
                if ($conn->query($users_sql) === TRUE) {
                $new_user_id = $conn->insert_id;
                }
                 // SQL για την εισαγωγή των δεδομένων στον πινακα students
                 $students_sql = "INSERT INTO students (student_id, name, surname, father_name, etos_eisag, phone, home_phone, adress, city, tk, user_id) 
                         VALUES ('$student_id', '$student_name', '$student_surname', '$student_father_name', '$student_etos_eisag', '$student_phone', '$student_home_phone', '$student_address', '$student_city', '$student_tk', $new_user_id)";
                 
                 // Εκτέλεση της SQL εντολής
                 if ($conn->query($students_sql) === TRUE) {
                     echo "Ο φοιτητής " . $student_name." ". $student_surname ." εισήχθη επιτυχώς.\n ";
                 } else {
                     echo "Σφάλμα κατά την εισαγωγή του φοιτητή " . $student_name." ". $student_surname .": " . $conn->error . " \n";
                 }
             }
         } 

         // Εισαγωγή δεδομένων για διδάσκοντες 
         if (isset($data['professors'])) {
            // Εισαγωγή των δεδομένων για κάθε φοιτητή
            foreach ($data['professors'] as $professor) {
                $professor_id = $professor['id'] ?? '';
                $professor_name = $professor['name'] ?? '';
                $professor_surname = $professor['surname'] ?? '';
                $professor_telephone = $professor['mobile_telephone'] ?? '';
                $professor_address = $professor['street'] ?? '';
                $professor_city = $professor['city'] ?? '';
                $professor_tk = $professor['postcode'] ?? '';
                $professor_department = $professor['email'] ?? '';
                $professor_office_contact = $professor['landline_telephone'] ?? '';
                $professor_email = $professor['email'] ?? '';
                $professor_password = $professor['password'] ?? '';
                $professor_role = 'Διδάσκων';
                
                // Έλεγχος για κενό email
                if (empty($professor_email)) {
                  echo "Ο διδάσκων " . $professor_name." ". $professor_surname ." δεν έχει email. Παράληψη.\n ";
                  continue;
                }

                // Έλεγχος για διπλό email
                $check_email = "SELECT user_id FROM users WHERE email = '$professor_email'";
                $result = $conn->query($check_email);
                if ($result && $result->num_rows > 0) {
                   echo "Το email $professor_email του διδάσκοντα " . $professor_name." ". $professor_surname ." υπάρχει ήδη. Παράληψη.\n ";
                   continue;
                }

                // Έλεγχος για κενό password
                if (empty($professor_password)) {
                  echo "Ο διδάσκων " . $professor_name." ". $professor_surname ." δεν έχει password. Παράληψη.\n ";
                  continue;
                }
                // SQL για την εισαγωγή των δεδομένων στον πινακα users
                $users_sql = "INSERT INTO users (email, password, role) VALUES ('$professor_email', '$professor_password', '$professor_role')";
                if ($conn->query($users_sql) === TRUE) {
                $new_user_id = $conn->insert_id;
                }
                // SQL για την εισαγωγή των δεδομένων στον πινακα professors
                $professors_sql = "INSERT INTO professors (professor_id, name, surname, telephone, adress, city, tk, department, office_contact, user_id) 
                        VALUES ('$professor_id', '$professor_name', '$professor_surname', '$professor_telephone', '$professor_address', '$professor_city', '$professor_tk', '$professor_department', '$professor_office_contact', '$new_user_id')";
                
                // Εκτέλεση της SQL εντολής
                if ($conn->query($professors_sql) === TRUE) {
                    echo "Ο διδάσκων " . $professor_name." ". $professor_surname ." εισήχθη επιτυχώς. \n";
                } else {
                    echo "Σφάλμα κατά την εισαγωγή του διδάσκοντα " . $professor_name." ". $professor_surname .": " . $conn->error . "\n";
                }
            }
        } else {
             echo "Δεν εισήχθησαν δεδομένα φοιτητών ή διδασκόντων.";
         }
         
     } else {
         echo "Δεν βρέθηκε αρχείο.";
     }
     
     // Κλείσιμο της σύνδεσης στη βάση
     $conn->close();
     ?>
     


                