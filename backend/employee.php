<?php
// Include the connection file
include('connection.php');  // Make sure the connection.php file is included

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight response
    http_response_code(204);
    exit;
}

// SQL query to fetch all employee data
$sql = "SELECT * FROM employee";
$result = $conn->query($sql);

$employees = [];

if ($result->num_rows > 0) {
    // Fetch all rows and store them in the $employees array
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }

    // Return employee data as a JSON response
    echo json_encode($employees);
} else {
    // No records found
    echo json_encode(["message" => "No employees found"]);
}

$conn->close();
?>
