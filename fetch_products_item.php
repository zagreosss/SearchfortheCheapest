<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "test1";
$password = "fRxEhisJnCDPmffG";
$dbname = "test1";

// 创建数据库连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT name, price, ml, marketname, weight FROM item";
$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    // 输出每行数据
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}
echo json_encode($products);

$conn->close();
?>