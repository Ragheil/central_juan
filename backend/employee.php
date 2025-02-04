<?php
include('connection.php');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Read request body
$inputData = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($inputData)) {
    $empId = $inputData['emp_id'];
    $firstname = $inputData['firstname'];
    $lastname = $inputData['lastname'];
    $contact_num = $inputData['contact_num'];
    $address = $inputData['address'];
    $birthday = $inputData['birthday'];
    $gender = $inputData['gender'];
    $position = $inputData['position'];

    // Update employee in the database
    $stmt = $conn->prepare("UPDATE employee SET firstname = ?, lastname = ?, contact_num = ?, address = ?, birthday = ?, gender = ?, position = ? WHERE emp_id = ?");
    $stmt->bind_param("sssssssi", $firstname, $lastname, $contact_num, $address, $birthday, $gender, $position, $empId);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Employee updated successfully"]);
    } else {
        echo json_encode(["message" => "Error updating employee"]);
    }

    $stmt->close();
} else {
    // Default: Return employees
    $sql = "SELECT * FROM employee";
    $result = $conn->query($sql);

    $employees = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
        echo json_encode($employees);
    } else {
        echo json_encode(["message" => "No employees found"]);
    }
}

$conn->close();
?>
