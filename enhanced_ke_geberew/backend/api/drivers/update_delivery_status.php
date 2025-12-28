<?php
require_once "../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);
$allowed = ['Picked Up', 'In Transit', 'Delivered'];

if (!in_array($data['status'], $allowed)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid status"]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE orders SET status=? WHERE id=? AND driver_id=?"
);
$stmt->bind_param(
    "sii",
    $data['status'],
    $data['order_id'],
    $data['driver_id']
);
$stmt->execute();

echo json_encode(["success" => true]);
