<?php
// Include the database connection file
include('../../connection.php');

// Define the query to select all records from the positions table
$query = "SELECT * FROM positions";

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
