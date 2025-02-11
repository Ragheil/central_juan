<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include('../connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input === null) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
        exit;
    }

    if (!isset($input['employee_id']) || empty($input['employee_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid or missing employee_id.']);
        exit;
    }

    $employee_id = $input['employee_id'];
    $first_name = $input['first_name'] ?? '';
    $middle_name = $input['middle_name'] ?? '';
    $last_name = $input['last_name'] ?? '';
    $email = $input['email'] ?? '';
    $contact_number = $input['contact_number'] ?? '';
    $date_of_birth = $input['date_of_birth'] ?? '';
    $department_id = $input['department_id'] ?? '';
    $position_id = $input['position_id'] ?? '';

    // Check if employee exists
    $checkStmt = $conn->prepare("SELECT * FROM employees WHERE employee_id = ?");
    $checkStmt->bind_param("s", $employee_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Employee not found.']);
        exit;
    }

    // Update query (without changing employee_id)
    $updateStmt = $conn->prepare("
        UPDATE employees 
        SET first_name = ?, middle_name = ?, last_name = ?, email = ?, 
            contact_number = ?, date_of_birth = ?, department_id = ?, position_id = ?
        WHERE employee_id = ?
    ");

    $updateStmt->bind_param("sssssssss", $first_name, $middle_name, $last_name, $email, 
                                         $contact_number, $date_of_birth, $department_id, $position_id, $employee_id);
    
    if ($updateStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Employee updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error updating employee.']);
    }
}
?>
