<?php
// Include the database connection file
include('../connection.php');

// Define the SQL query to fetch all departments
$sql = "SELECT * FROM `departments`";

// Execute the query
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $departments = [];

    // Fetch all rows and store in an array
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }

    // Return the results as a JSON response
    echo json_encode(["status" => "success", "data" => $departments]);
} else {
    echo json_encode(["status" => "error", "message" => "No departments found"]);
}

// Close the connection
$conn->close();
?>
