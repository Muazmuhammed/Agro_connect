<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';

$database = new Database();
$db = $database->getConnection();

$token = verifyToken();
$user = getUserFromToken($token, $db);

// Only farmers can create products
if ($user['role'] !== 'farmer') {
    http_response_code(403);
    echo json_encode(array("message" => "Access denied"));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->price) && !empty($data->quantity)) {
    
    $query = "INSERT INTO products (farmer_id, name, category, quantity, price, location, status) 
              VALUES (:farmer_id, :name, :category, :quantity, :price, :location, :status)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':farmer_id', $user['user_id']);
    $stmt->bindParam(':name', $data->name);
    $category = isset($data->category) ? $data->category : '';
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':quantity', $data->quantity);
    $stmt->bindParam(':price', $data->price);
    $location = isset($data->location) ? $data->location : '';
    $stmt->bindParam(':location', $location);
    $status = 'active';
    $stmt->bindParam(':status', $status);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Product created successfully",
            "product_id" => $db->lastInsertId()
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create product"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data"));
}
?>
