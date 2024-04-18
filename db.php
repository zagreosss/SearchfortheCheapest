<?php
$servername = "localhost";
$username = "user";  // 数据库用户名
$password = "pGsPC2aTXtb3peni";  // 数据库密码
$database = "user";  // 数据库名称

// 创建连接
$conn = new mysqli($servername, $username, $password, $database);

// 检查连接
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>