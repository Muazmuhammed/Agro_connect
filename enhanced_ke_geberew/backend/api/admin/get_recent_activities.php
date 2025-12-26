<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';

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

    $query = "SELECT aa.*, a.name as admin_name 
              FROM admin_activity aa 
              JOIN admins a ON aa.admin_id = a.admin_id 
              ORDER BY aa.action_date DESC 
              LIMIT 20";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $activities = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $activities[] = array(
            "id" => $row['activity_id'],
            "admin_id" => $row['admin_id'],
            "admin_name" => $row['admin_name'],
            "action_type" => $row['action_type'],
            "description" => $row['description'],
            "action_date" => $row['action_date']
        );
    }
    
    http_response_code(200);
    echo json_encode($activities);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Error fetching activities", "error" => $e->getMessage()));
}
?>
