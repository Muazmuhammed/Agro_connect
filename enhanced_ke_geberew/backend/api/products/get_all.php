<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get query parameters for filtering
$category = isset($_GET['category']) ? $_GET['category'] : '';
$location = isset($_GET['location']) ? $_GET['location'] : '';
$status = isset($_GET['status']) ? $_GET['status'] : 'active';

$query = "SELECT p.*, u.name as farmer_name, u.location as farmer_location 
          FROM products p 
          INNER JOIN users u ON p.farmer_id = u.user_id 
          WHERE p.status = :status";

if (!empty($category)) {
    $query .= " AND p.category = :category";
}

if (!empty($location)) {
    $query .= " AND p.location LIKE :location";
}

$query .= " ORDER BY p.created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(':status', $status);

if (!empty($category)) {
    $stmt->bindParam(':category', $category);
}

if (!empty($location)) {
    $location_param = "%{$location}%";
    $stmt->bindParam(':location', $location_param);
}

$stmt->execute();

$products = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $products[] = $row;
}

http_response_code(200);
echo json_encode($products);
?>
