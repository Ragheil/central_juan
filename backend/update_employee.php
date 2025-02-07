<?php
include('connection.php'); // Include your database connection file

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (isset($data->employee_id) && isset($data->first_name) && isset($data->last_name)) {
    $employee_id = $data->employee_id;
    $first_name = $data->first_name;
    $last_name = $data->last_name;
    $email = $data->email;
    $contact_number = $data->contact_number;
    $date_of_birth = $data->date_of_birth;
    $department_id = $data->department_id;
    $position_title = $data->position_title;

    $stmt = $conn->prepare("UPDATE employees SET first_name=?, last_name=?, email=?, contact_number=?, date_of_birth=?, department_id=?, position_title=? WHERE employee_id=?");
    $stmt->bind_param("sssssssi", $first_name, $last_name, $email, $contact_number, $date_of_birth, $department_id, $position_title, $employee_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating employee.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
}

$conn->close();
?>