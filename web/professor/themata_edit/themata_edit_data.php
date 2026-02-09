<?php
session_start();
include('../../db.php');

// Έλεγχος αν ο χρήστης έχει συνδεθεί
if (!isset($_SESSION['user_id'])) {
    header("Location: Login.html");
    exit();
}

$user_id = $_SESSION['user_id'];


$id = "SELECT professor_id FROM professors WHERE user_id=$user_id";
$residResult = $conn->query($id);
$resid = $residResult->fetch_assoc()['professor_id'];

if(isset($_POST['title'])){
    $idThemata = $_POST['id'];
    $title = $_POST["title"];
    $description =$_POST["description"];
    $file = $_FILES['file']['name'];


if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $targetDir = "uploads/";
    $fileName = basename($_FILES['file']['name']);
    $targetFilePath = $targetDir . $fileName;

   
    error_log("Uploading file: " . $_FILES['file']['name']);

    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
        $fileUploaded = true;
    } else {
        $fileUploaded = false;
        $error = "File upload failed.";
        error_log("File upload failed.");
    }
} else {
    $fileUploaded = false;
    $error = "No file uploaded or file error.";
    error_log("File upload error: " . $_FILES['file']['error']);
}

$stmt = $conn->prepare("UPDATE themata_a SET title = ?, description = ?, pdf_file = ? WHERE themata_a_id=?");
$stmt ->bind_param("sssi",$title, $description,$fileName,$idThemata);
if($stmt->execute()){
    $_SESSION['title'] = $title;
    header("Location: ../themata_projection/themata_projection.html");

    exit();
}else{
    $error = "Registration falled";
}
}
$stmt->close();

?>
