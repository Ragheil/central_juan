<?php
include('connection.php'); // Include your database connection file

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if (!empty($_GET['id'])) {
    $employee_id = $_GET['id'];

    // Use strict comparison and query sanitization to avoid issues
    $stmt = $conn->prepare("DELETE FROM employees WHERE employee_id = ?");
    $stmt->bind_param("s", $employee_id); // "s" for strings

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => "Employee with ID {$employee_id} deleted."]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Employee not found or deletion failed.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid employee ID.']);
}

$conn->close();
?>
