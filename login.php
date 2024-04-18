<?php
session_start();
include 'db.php';  // 引入数据库连接文件

$username = $_POST['username'];
$password = $_POST['password'];

// 使用预处理语句来避免SQL注入
$stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        // 密码匹配
        $_SESSION['username'] = $username;  // 设置session
        echo "<script>
                
                alert('Valid password');
                window.location.href = 'index.html?username=" . urlencode($username) . "';
              </script>";
    } else {
        echo "<script>
        alert('Invalid password');
        window.location.href = 'login.html';
        </script>";
    }
} else {
    echo "<script>
    alert('Invalid username');
    window.location.href = 'login.html';
    </script>";
}
$stmt->close();
$conn->close();
?>