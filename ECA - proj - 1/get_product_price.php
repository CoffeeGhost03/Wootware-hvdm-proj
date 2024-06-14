<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "WootwareDatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$productName = $data['productName'];

$stmt = $conn->prepare("SELECT price FROM ProductDetails WHERE productName = ?");
$stmt->bind_param("s", $productName);
$stmt->execute();
$stmt->bind_result($price);
$stmt->fetch();
$stmt->close();

$conn->close();

echo json_encode(['price' => $price]);
?>
