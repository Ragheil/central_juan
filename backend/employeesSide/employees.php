<?php
include('../connection.php');

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Check if database connection exists
if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Handle employee count request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['count'])) {
    $query = "SELECT COUNT(*) AS total_count FROM employees";
    $result = $conn->query($query);

    if ($result) {
        $data = $result->fetch_assoc();
        echo json_encode(["total_count" => $data['total_count']]);
    } else {
        echo json_encode(["error" => "Failed to fetch employee count"]);
    }

    $conn->close();
    exit();
}

// Fetch all employees
$query = "SELECT * FROM employees";
$result = $conn->query($query);

if ($result) {
    $employees = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($employees);
} else {
    echo json_encode(["error" => "Failed to fetch employees"]);
}

$conn->close();
?>
