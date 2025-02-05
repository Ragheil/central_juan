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
    $employeeId = $inputData['employee_id'];
    $firstName = $inputData['first_name'];
    $middleName = $inputData['middle_name'];
    $lastName = $inputData['last_name'];
    $email = $inputData['email'];
    $contactNumber = $inputData['contact_number'];
    $dob = $inputData['date_of_birth'];
    $departmentId = $inputData['department_id'];
    $positionTitle = $inputData['position_title'];

    // Update employee in the database
    $stmt = $conn->prepare("
        UPDATE employees 
        SET first_name = ?, middle_name = ?, last_name = ?, email = ?, contact_number = ?, date_of_birth = ?, department_id = ?, position_title = ? 
        WHERE employee_id = ?
    ");
    $stmt->bind_param(
        "sssssssss", 
        $firstName, $middleName, $lastName, $email, $contactNumber, $dob, $departmentId, $positionTitle, $employeeId
    );

    if ($stmt->execute()) {
        echo json_encode(["message" => "Employee updated successfully"]);
    } else {
        echo json_encode(["message" => "Error updating employee"]);
    }

    $stmt->close();
} else {
    // Default: Return employees
    $sql = "SELECT * FROM employees";
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
