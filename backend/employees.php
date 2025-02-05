<?php
include('connection.php');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Disable error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Enable error logging for debugging (development only)
ini_set('log_errors', 1);
ini_set('error_log', '/path-to-your-log/php-error.log');

// Handle OPTIONS request for preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Read the input data
$inputData = json_decode(file_get_contents("php://input"), true);

// Validate input data for PUT and POST requests
if (!$inputData && ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT')) {
    echo json_encode(["message" => "Invalid input data"]);
    http_response_code(400);
    exit;
}

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
        // Validate required fields for POST
        if (empty($inputData['employee_id']) || empty($inputData['first_name']) || empty($inputData['last_name'])) {
            echo json_encode(["message" => "Employee ID, first name, and last name are required"]);
            http_response_code(400);
            exit;
        }

        // Handle null value for middle_name explicitly
        $middleName = $inputData['middle_name'] ?? null;

        // Add a new employee
        $stmt = $conn->prepare("
            INSERT INTO employees (employee_id, first_name, middle_name, last_name, email, contact_number, date_of_birth, department_id, position_title)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sssssssss",
            $inputData['employee_id'], $inputData['first_name'], $middleName,
            $inputData['last_name'], $inputData['email'], $inputData['contact_number'],
            $inputData['date_of_birth'], $inputData['department_id'], $inputData['position_title']
        );

        if ($stmt->execute()) {
            echo json_encode(["message" => "Employee added successfully"]);
        } else {
            error_log("SQL Error: " . $stmt->error);
            echo json_encode(["message" => "Error adding employee", "error" => $stmt->error]);
            http_response_code(500);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Validate required fields for PUT
        if (empty($inputData['employee_id'])) {
            echo json_encode(["message" => "Employee ID is required"]);
            http_response_code(400);
            exit;
        }

        $middleName = $inputData['middle_name'] ?? null;

        // Update employee data
        $stmt = $conn->prepare("
            UPDATE employees
            SET first_name = ?, middle_name = ?, last_name = ?, email = ?, contact_number = ?, date_of_birth = ?, department_id = ?, position_title = ?
            WHERE employee_id = ?
        ");
        $stmt->bind_param(
            "sssssssss",
            $inputData['first_name'], $middleName, $inputData['last_name'],
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
        // Validate employee_id for DELETE
        if (empty($_GET['employee_id'])) {
            echo json_encode(["message" => "Employee ID is required"]);
            http_response_code(400);
            exit;
        }

        $employeeId = $_GET['employee_id'];
        $stmt = $conn->prepare("DELETE FROM employees WHERE employee_id = ?");
        $stmt->bind_param("s", $employeeId);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Employee deleted successfully"]);
        } else {
            error_log("SQL Error: " . $stmt->error);
            echo json_encode(["message" => "Error deleting employee", "error" => $stmt->error]);
            http_response_code(500);
        }
        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

$conn->close();
?>
