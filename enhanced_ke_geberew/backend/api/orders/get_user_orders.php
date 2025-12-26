<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';

$database = new Database();
$db = $database->getConnection();

$token = verifyToken();
$user = getUserFromToken($token, $db);

if ($user['role'] === 'buyer') {
    // Get orders for buyer
    $query = "SELECT o.*, p.name as product_name, p.category, u.name as farmer_name, u.location as farmer_location
              FROM orders o
              INNER JOIN products p ON o.product_id = p.product_id
              INNER JOIN users u ON p.farmer_id = u.user_id
              WHERE o.merchant_id = :user_id
              ORDER BY o.order_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user['user_id']);
    
} elseif ($user['role'] === 'farmer') {
    // Get orders for farmer's products
    $query = "SELECT o.*, p.name as product_name, p.category, u.name as buyer_name, u.location as buyer_location
              FROM orders o
              INNER JOIN products p ON o.product_id = p.product_id
              INNER JOIN users u ON o.merchant_id = u.user_id
              WHERE p.farmer_id = :user_id
              ORDER BY o.order_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user['user_id']);
    
} else {
    http_response_code(403);
    echo json_encode(array("message" => "Access denied"));
    exit();
}

$stmt->execute();
$orders = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $orders[] = $row;
}

http_response_code(200);
echo json_encode($orders);
?>
