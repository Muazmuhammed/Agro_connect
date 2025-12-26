<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->role)) {
    
    
    if ($data->role === 'admin') {
        http_response_code(403);
        echo json_encode(array("message" => "Admins cannot be registered through this endpoint"));
        exit();
    }
    
    $table = '';
    $id_field = '';
    
    switch($data->role) {
        case 'farmer':
        case 'buyer':
            $table = 'users';
            $id_field = 'user_id';
            break;
        case 'driver':
            $table = 'drivers';
            $id_field = 'driver_id';
            break;
        default:
            http_response_code(400);
            echo json_encode(array("message" => "Invalid role"));
            exit();
    }
    
    // Check if email already exists
    $check_query = "SELECT email FROM " . $table . " WHERE email = :email LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':email', $data->email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists"));
        exit();
    }
    
    // Hash password
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
    
    // Insert user
    if ($table === 'users') {
        $query = "INSERT INTO users (name, email, password, location, role) VALUES (:name, :email, :password, :location, :role)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $hashed_password);
        $location = isset($data->location) ? $data->location : null;
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':role', $data->role);
    } else {
        // Driver registration
        if (empty($data->national_id) || empty($data->license_number)) {
            http_response_code(400);
            echo json_encode(array("message" => "Missing required driver information"));
            exit();
        }
        
        $query = "INSERT INTO drivers (name, email, password, national_id, license_number) VALUES (:name, :email, :password, :national_id, :license_number)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':national_id', $data->national_id);
        $stmt->bindParam(':license_number', $data->license_number);
    }
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Registration successful"));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to register user"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data"));
}
?>
