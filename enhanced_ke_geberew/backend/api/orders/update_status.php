<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';

$database = new Database();
$db = $database->getConnection();

$token = verifyToken();
$user = getUserFromToken($token, $db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_id) && !empty($data->status)) {
    
    // Verify user has permission to update this order
    if ($user['role'] === 'farmer') {
        // Farmer can update orders for their products
        $check_query = "SELECT o.* FROM orders o 
                       INNER JOIN products p ON o.product_id = p.product_id 
                       WHERE o.order_id = :order_id AND p.farmer_id = :user_id";
    } elseif ($user['role'] === 'admin') {
        // Admin can update any order
        $check_query = "SELECT * FROM orders WHERE order_id = :order_id";
    } else {
        http_response_code(403);
        echo json_encode(array("message" => "Access denied"));
        exit();
    }
    
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':order_id', $data->order_id);
    if ($user['role'] === 'farmer') {
        $check_stmt->bindParam(':user_id', $user['user_id']);
    }
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Order not found"));
        exit();
    }
    
    $query = "UPDATE orders SET status = :status WHERE order_id = :order_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':order_id', $data->order_id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Order status updated successfully"));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update order"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data"));
}
?>
