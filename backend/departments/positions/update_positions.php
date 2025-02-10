<?php
// Enable detailed error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('../../connection.php');

$data = json_decode(file_get_contents("php://input"), true);

// Check for JSON decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON format"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!isset($data['position_id'], $data['new_position_id'], $data['position_name'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required position data"]);
        exit();
    }

    $position_id = $data['position_id'];
    $new_position_id = $data['new_position_id'];
    $position_name = $data['position_name'];

    if (empty(trim($position_id)) || empty(trim($new_position_id)) || empty(trim($position_name))) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Position fields cannot be empty"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE `positions` SET `position_id` = ?, `position_name` = ? WHERE `position_id` = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("sss", $new_position_id, $position_name, $position_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Position updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error updating position: " . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

$conn->close();
?>
