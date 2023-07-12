<?php
include ('C:\xampp\htdocs\1\credentials.php');

$data = json_decode(file_get_contents('php://input'), true);
$game_id = $data['game_id'];

try {
    $conn = new PDO('mysql:host=' . $servername . ';dbname=' . $database_name . ';port=' . $port . ';charset=' . $charset, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = $conn->prepare("SELECT * FROM `score` WHERE game_id=:game_id ORDER BY `id` DESC");
    $query->bindParam(':game_id', $game_id, PDO::PARAM_INT);
    $query->execute();
    
    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    // Pobranie wyników zapytania do tablicy asocjacyjnej
    foreach ($result as $row) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>"; // Wyświetlenie wartości kolumny
        echo "<td>" . $row['creation_time'] . "</td>";
        echo "<td>" . $row['modification_time'] . "</td>";
        echo "<td>" . $row['deleted'] . "</td>";
        echo "<td>" . $row['game_id'] . "</td>";
        echo "<td>" . $row['player_id'] . "</td>";
        echo "<td>" . $row['value'] . "</td>";
        echo "</tr>";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

