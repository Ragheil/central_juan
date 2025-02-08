

<?php 
include('connection.php'); 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['count'])) {
    $result = $conn->query("SELECT COUNT(*) AS total_count FROM employees");
    $data = $result->fetch_assoc();
    echo json_encode(['total_count' => $data['total_count']]);
    $conn->close();
    exit();
}

// Fetch all employees
$result = $conn->query("SELECT * FROM employees");
$employees = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
}

echo json_encode($employees);
$conn->close();
?>
