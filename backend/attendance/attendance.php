<?php
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../connection.php'; // Adjust path based on your folder structure

$sql = "SELECT * FROM attendance";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $attendanceData = [];
    while ($row = $result->fetch_assoc()) {
        $attendanceData[] = $row;
    }
    echo json_encode(["success" => true, "data" => $attendanceData]);
} else {
    echo json_encode(["success" => false, "message" => "No records found."]);
}

$conn->close();
?>
