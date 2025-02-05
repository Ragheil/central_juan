<?php
include('connection.php');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Role");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle OPTIONS request for preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Read the input data
$inputData = json_decode(file_get_contents("php://input"), true);
error_log("Input Data: " . print_r($inputData, true)); // Log input data

// Validate input data for POST and PUT requests
if (!$inputData && ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT')) {
    echo json_encode(["message" => "Invalid input data"]);
    http_response_code(400);
    exit;
}

// Mock role validation (replace this with real user role validation)
$role = $_SERVER['HTTP_ROLE'] ?? ''; // Assuming role is passed in headers for simplicity

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Fetch all employees
        $result = $conn->query("SELECT * FROM employees");
        $employees = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $employees[] = $row;
            }
        }
        echo json_encode($employees);
        break;

    case 'POST':
        // Check if the user has admin role
        if ($role !== 'admin') {
            echo json_encode(["message" => "Unauthorized: Only admins can add employees"]);
            http_response_code(403);
            exit;
        }

        // Validate required fields
        if (empty($inputData['employee_id']) || empty($inputData['first_name']) || empty($inputData['last_name'])) {
            echo json_encode(["message" => "Employee ID, first name, and last name are required"]);
            http_response_code(400);
            exit;
        }

        // Prepare data for insertion
        $firstName = $inputData['first_name'];
        $middleName = $inputData['middle_name'] ?? null;
        $lastName = $inputData['last_name'];
        $email = $inputData['email'];
        $contactNumber = $inputData['contact_number'] ?? null;
        $dateOfBirth = $inputData['date_of_birth'] ?? null;
        $departmentId = $inputData['department_id'] ?? null;
        $positionTitle = $inputData['position_title'] ?? null;

        // Insert new employee record
        $insertQuery = "INSERT INTO employees (employee_id, first_name, middle_name, last_name, email, contact_number, date_of_birth, department_id, position_title) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param(
            "sssssssss",
            $inputData['employee_id'], // Use the provided employee ID
            $firstName,
            $middleName,
            $lastName,
            $email,
            $contactNumber,
            $dateOfBirth,
            $departmentId,
            $positionTitle
        );

        if ($insertStmt->execute()) {
            echo json_encode(["success" => true, "message" => "Employee added successfully."]);
        } else {
            error_log("SQL Error: " . $insertStmt->error); // Log SQL error
            echo json_encode(["success" => false, "message" => "Failed to add employee."]);
            http_response_code(500);
        }

        $insertStmt->close();
        break;

    case 'PUT':
        // Check if the user has admin role
        if ($role !== 'admin') {
            echo json_encode(["message" => "Unauthorized: Only admins can update employees"]);
            http_response_code(403);
            exit;
        }

        // Validate required fields
        if (empty($inputData['employee_id'])) {
            echo json_encode(["message" => "Employee ID is required"]);
            http_response_code(400);
            exit;
        }

        $middleName = $inputData['middle_name'] ?? null;

        $stmt = $conn->prepare("
            UPDATE employees
            SET first_name = ?, middle_name = ?, last_name = ?, email = ?, contact_number = ?, date_of_birth = ?, department_id = ?, position_title = ?
            WHERE employee_id = ?
        ");
        $stmt->bind_param(
            "sssssssss",
            $inputData['first_name'], $middleName, $inputData[' last_name'],
            $inputData['email'], $inputData['contact_number'], $inputData['date_of_birth'],
            $inputData['department_id'], $inputData['position_title'], $inputData['employee_id']
        );

        if ($stmt->execute()) {
            echo json_encode(["message" => "Employee updated successfully"]);
        } else {
            error_log("SQL Error: " . $stmt->error);
            echo json_encode(["message" => "Error updating employee", "error" => $stmt->error]);
            http_response_code(500);
        }
        $stmt->close();
        break;

    case 'DELETE':
        // Check if the user has admin role
        if ($role !== 'admin') {
            echo json_encode(["message" => "Unauthorized: Only admins can delete employees"]);
            http_response_code(403);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $employeeId = $input['employee_id'] ?? null;

        if ($employeeId) {
            $query = "DELETE FROM employees WHERE employee_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $employeeId);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Employee deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete employee."]);
            }

            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Employee ID is required."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

$conn->close();
?> 