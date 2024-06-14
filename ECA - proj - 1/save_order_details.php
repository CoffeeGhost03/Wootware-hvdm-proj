<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "WootwareDatabase";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$cart = $data['cart'];
$totalAmount = $data['totalAmount'];

$orderDetails = implode(', ', array_map(function($item) {
    return $item['productName'];
}, $cart));

$stmt = $conn->prepare("INSERT INTO OrderDetails (orderDetails, totalAmount) VALUES (?, ?)");
$stmt->bind_param("sd", $orderDetails, $totalAmount);
$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);
?>
