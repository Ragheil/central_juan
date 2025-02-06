<?php
include('connection.php'); // Include your database connection file

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Fetch all employees
$result = $conn->query("SELECT * FROM employees");
$employees = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row; // Add each row to the employees array
    }
}

// Return the employees data as JSON
echo json_encode($employees);

// Close the database connection
$conn->close();
?>