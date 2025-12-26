<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';

$database = new Database();
$db = $database->getConnection();

$token = verifyToken();
$user = getUserFromToken($token, $db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->product_id)) {
    
    // Check if product belongs to farmer
    $check_query = "SELECT * FROM products WHERE product_id = :product_id AND farmer_id = :farmer_id";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':product_id', $data->product_id);
    $check_stmt->bindParam(':farmer_id', $user['user_id']);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() == 0) {
        http_response_code(403);
        echo json_encode(array("message" => "Access denied or product not found"));
        exit();
    }
    
    $query = "UPDATE products SET ";
    $updates = array();
    
    if (isset($data->name)) {
        $updates[] = "name = :name";
    }
    if (isset($data->category)) {
        $updates[] = "category = :category";
    }
    if (isset($data->quantity)) {
        $updates[] = "quantity = :quantity";
    }
    if (isset($data->price)) {
        $updates[] = "price = :price";
    }
    if (isset($data->location)) {
        $updates[] = "location = :location";
    }
    if (isset($data->status)) {
        $updates[] = "status = :status";
    }
    
    $query .= implode(", ", $updates);
    $query .= " WHERE product_id = :product_id AND farmer_id = :farmer_id";
    
    $stmt = $db->prepare($query);
    
    if (isset($data->name)) {
        $stmt->bindParam(':name', $data->name);
    }
    if (isset($data->category)) {
        $stmt->bindParam(':category', $data->category);
    }
    if (isset($data->quantity)) {
        $stmt->bindParam(':quantity', $data->quantity);
    }
    if (isset($data->price)) {
        $stmt->bindParam(':price', $data->price);
    }
    if (isset($data->location)) {
        $stmt->bindParam(':location', $data->location);
    }
    if (isset($data->status)) {
        $stmt->bindParam(':status', $data->status);
    }
    
    $stmt->bindParam(':product_id', $data->product_id);
    $stmt->bindParam(':farmer_id', $user['user_id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Product updated successfully"));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update product"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Product ID required"));
}
?>
