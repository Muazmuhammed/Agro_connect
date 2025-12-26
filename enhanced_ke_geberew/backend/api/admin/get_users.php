<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();


$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';

if (empty($token)) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized"));
    exit();
}

$token_data = json_decode(base64_decode($token), true);
if (!$token_data || $token_data['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(array("message" => "Access denied"));
    exit();
}

try {
    $query = "SELECT user_id, name, email, location, role, created_at FROM users ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $users = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $users[] = $row;
    }
    
    http_response_code(200);
    echo json_encode($users);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Error fetching users", "error" => $e->getMessage()));
}
?>
