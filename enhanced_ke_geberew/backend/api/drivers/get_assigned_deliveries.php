<?php
require_once "../../config/database.php";
//
$driver_id = $_GET['driver_id'];

$query = "SELECT * FROM orders WHERE driver_id=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $driver_id);
$stmt->execute();

$result = $stmt->get_result();
$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders);
