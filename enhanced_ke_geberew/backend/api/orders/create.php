<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';

$database = new Database();
$db = $database->getConnection();

$token = verifyToken();
$user = getUserFromToken($token, $db);

// Only buyers can create orders
if ($user['role'] !== 'buyer') {
    http_response_code(403);
    echo json_encode(array("message" => "Access denied"));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->product_id) && !empty($data->quantity)) {
    
    // Get product details
    $product_query = "SELECT * FROM products WHERE product_id = :product_id AND status = 'active'";
    $product_stmt = $db->prepare($product_query);
    $product_stmt->bindParam(':product_id', $data->product_id);
    $product_stmt->execute();
    
    if ($product_stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Product not found or not available"));
        exit();
    }
    
    $product = $product_stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if quantity is available
    if ($product['quantity'] < $data->quantity) {
        http_response_code(400);
        echo json_encode(array("message" => "Insufficient quantity available"));
        exit();
    }
    
    // Calculate total price
    $total_price = $product['price'] * $data->quantity;
    $transport_cost = isset($data->transport_cost) ? $data->transport_cost : 0.00;
    
    // Create order
    $query = "INSERT INTO orders (product_id, merchant_id, quantity, total_price, transport_cost, status) 
              VALUES (:product_id, :merchant_id, :quantity, :total_price, :transport_cost, 'pending')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':product_id', $data->product_id);
    $stmt->bindParam(':merchant_id', $user['user_id']);
    $stmt->bindParam(':quantity', $data->quantity);
    $stmt->bindParam(':total_price', $total_price);
    $stmt->bindParam(':transport_cost', $transport_cost);
    
    if ($stmt->execute()) {
        $order_id = $db->lastInsertId();
        
        // Update product quantity
        $update_query = "UPDATE products SET quantity = quantity - :quantity WHERE product_id = :product_id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(':quantity', $data->quantity);
        $update_stmt->bindParam(':product_id', $data->product_id);
        $update_stmt->execute();
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Order created successfully",
            "order_id" => $order_id,
            "total_price" => $total_price,
            "transport_cost" => $transport_cost
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create order"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data"));
}
?>
