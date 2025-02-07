<?php
include('connection.php'); // Include your database connection file

// Set headers to allow CORS and handle content
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Adding a new employee
    $data = json_decode(file_get_contents("php://input"));

    // Check if required fields are set
    if (
        isset($data->employee_id, $data->first_name, $data->middle_name, $data->last_name, 
              $data->email, $data->contact_number, $data->date_of_birth, 
              $data->department_id, $data->position_title)
    ) {
        $employee_id = $data->employee_id;
        $first_name = $data->first_name;
        $middle_name = $data->middle_name;
        $last_name = $data->last_name;
        $email = $data->email;
        $contact_number = $data->contact_number;
        $date_of_birth = $data->date_of_birth;
        $department_id = $data->department_id;
        $position_title = $data->position_title;

        // Prepare the SQL query with employee_id
        $stmt = $conn->prepare(
            "INSERT INTO employees 
            (employee_id, first_name, middle_name, last_name, email, contact_number, date_of_birth, department_id, position_title) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        // Bind the parameters for the SQL statement
        $stmt->bind_param("sssssssss", $employee_id, $first_name, $middle_name, $last_name, 
                          $email, $contact_number, $date_of_birth, $department_id, $position_title);

        // Execute the query and check if it was successful
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => "Employee {$first_name} {$last_name} added successfully."]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error adding employee.']);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or missing input data.']);
    }
} elseif ($method === 'DELETE') {
    // Deleting an employee
    if (!empty($_GET['id'])) {
        $employee_id = $_GET['id'];

        // Prepare the SQL query to delete an employee by ID
        $stmt = $conn->prepare("DELETE FROM employees WHERE employee_id = ?");
        $stmt->bind_param("s", $employee_id);

        // Execute the delete query and check if the employee was deleted
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => "Employee with ID {$employee_id} deleted."]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Employee not found or deletion failed.']);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid employee ID.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Unsupported request method.']);
}

// Close the database connection
$conn->close();
?>
