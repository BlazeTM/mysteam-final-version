<?php
include('credentials.php');

try {
    $pdo = new PDO('mysql:host=' . $servername . ';dbname=' . $database_name . ';port=' . $port . ';charset=' . $charset, $username, $password);

} catch (PDOException $e) {
    die("Błąd połączenia");
}
?>