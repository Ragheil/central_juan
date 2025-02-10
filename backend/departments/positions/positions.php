<?php
// Allow CORS from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include('../../connection.php');

// Get department ID from request
$departmentId = $_GET['department_id'] ?? '';

if (empty($departmentId)) {
    echo json_encode(["success" => false, "message" => "Department ID is required"]);
    exit;
}

// Prepare SQL statement
$stmt = $conn->prepare("SELECT position_id, position_name FROM positions WHERE department_id = ?");
$stmt->bind_param("s", $departmentId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $positions = [];

    while ($row = $result->fetch_assoc()) {
        $positions[] = $row;
    }

    echo json_encode(["success" => true, "data" => $positions]);
} else {
    echo json_encode(["success" => false, "message" => "Query failed"]);
}

$stmt->close();
$conn->close();
?>
