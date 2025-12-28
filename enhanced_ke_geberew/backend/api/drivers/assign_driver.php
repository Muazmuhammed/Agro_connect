<?php
require_once "../../config/database.php";

function assignDriverToOrder($order_id, $conn) {
    // Get available driver
    $driverQuery = "SELECT id FROM users 
                    WHERE role='driver' AND availability='available' 
                    LIMIT 1";
    $driverResult = $conn->query($driverQuery);

    if ($driverResult && $driverResult->num_rows > 0) {
        $driver = $driverResult->fetch_assoc();
        $driver_id = $driver['id'];

        // Assign driver
        $updateOrder = $conn->prepare(
            "UPDATE orders SET driver_id=?, status='Assigned' WHERE id=?"
        );
        $updateOrder->bind_param("ii", $driver_id, $order_id);
        $updateOrder->execute();

        // Mark driver busy
        $conn->query(
            "UPDATE users SET availability='busy' WHERE id=$driver_id"
        );

        return true;
    }

    // No drivers available
    $conn->query(
        "UPDATE orders SET status='Pending Assignment' WHERE id=$order_id"
    );
    return false;
}
