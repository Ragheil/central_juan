<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight response
    http_response_code(204);
    exit;
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "central_juan_hris";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["message" => "Database connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['username'] ?? '';
$pass = $data['password'] ?? '';

$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row['password'] === md5($pass)) {
        echo json_encode(["message" => "Login successful", "role" => $row['role']]);
    } else {
        echo json_encode(["message" => "Invalid credentials"]);
    }
} else {
    echo json_encode(["message" => "Invalid credentials"]);
}

$stmt->close();
$conn->close();
?>
