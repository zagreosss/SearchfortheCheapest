<?php
include 'db.php';  // 引入数据库连接文件

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);  // 对密码进行哈希处理

// 检查用户名是否已存在
$checkUser = $conn->prepare("SELECT username FROM users WHERE username = ?");
$checkUser->bind_param("s", $username);
$checkUser->execute();
$checkUser->store_result();
if ($checkUser->num_rows > 0) {
    echo "Username already exists!";
    $checkUser->close();
} else {
    $checkUser->close();
    // 插入新用户
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();

    if ($stmt->affected_rows === 1) {
        echo "User registered successfully.";
        header("Location: login.html");  // 注册成功后重定向到登录页面
    } else {
        echo "Registration failed.";
    }
    $stmt->close();
}
$conn->close();
?>