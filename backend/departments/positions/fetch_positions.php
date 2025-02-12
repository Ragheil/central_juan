<?php
// Include the database connection file
include('../../connection.php');

// Get the department_id from the query parameters
$department_id = isset($_GET['department_id']) ? mysqli_real_escape_string($conn, $_GET['department_id']) : '';

// Define the query to select records from the positions table based on department_id
if (!empty($department_id)) {
    $query = "SELECT * FROM positions WHERE department_id = '$department_id'";
} else {
    // If no valid department_id is provided, return an empty array
    $query = "SELECT * FROM positions WHERE 1=0"; // This will return no results
}

// Execute the query
$result = mysqli_query($conn, $query);

if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}

// Fetch the data as an associative array
$positions = [];
while ($row = mysqli_fetch_assoc($result)) {
    $positions[] = $row;
}

// Return the positions as JSON
header('Content-Type: application/json');
echo json_encode($positions);

// Close the database connection
mysqli_close($conn);
?>