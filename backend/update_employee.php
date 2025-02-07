<?php
include('connection.php');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || empty($data['employee_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

$stmt = $conn->prepare("UPDATE employees SET first_name=?, middle_name=?, last_name=?, email=?, contact_number=?, date_of_birth=?, department_id=?, position_title=? WHERE employee_id=?");
$stmt->bind_param(
    "sssssssss", 
    $data['first_name'], $data['middle_name'], $data['last_name'], $data['email'], $data['contact_number'], $data['date_of_birth'], $data['department_id'], $data['position_title'], $data['employee_id']);




if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
