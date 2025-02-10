<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include('../../connection.php');

// Read the input data
$data = json_decode(file_get_contents("php://input"), true);

// Check required fields
if (isset($data['position_id'], $data['position_name'], $data['department_id'])) {
    $position_id = $conn->real_escape_string($data['position_id']);
    $position_name = $conn->real_escape_string($data['position_name']);
    $department_id = $conn->real_escape_string($data['department_id']);

    $sql = "INSERT INTO positions (position_id, position_name, department_id) VALUES ('$position_id', '$position_name', '$department_id')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Position added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid position data"]);
}

$conn->close();
?>
