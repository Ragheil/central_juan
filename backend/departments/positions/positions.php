<?php
header('Content-Type: application/json');
include('../../connection.php');

$departmentId = $_GET['department_id'] ?? '';

if (empty($departmentId)) {
    echo json_encode(["message" => "Department ID is required"]);
    exit;
}

$stmt = $conn->prepare("SELECT position_id, position_name FROM positions WHERE department_id = ?");
$stmt->bind_param("s", $departmentId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $positions = [];

    while ($row = $result->fetch_assoc()) {
        $positions[] = $row;
    }

    echo json_encode($positions);
} else {
    echo json_encode(["message" => "Query failed"]);
}

$stmt->close();
$conn->close();
?>
