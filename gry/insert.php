<?php
include ('C:\xampp\htdocs\1\credentials.php');
// Odbierz dane JSON
$data = json_decode(file_get_contents('php://input'), true);

// Odczytaj wartość zmiennej wynik i game_id
$wynik = $data['wynik'];
$game_id = $data['game_id'];
try {
    // Utwórz nowe połączenie PDO
    $dbh = new PDO('mysql:host=' . $servername . ';dbname=' . $database_name . ';port=' . $port . ';charset=' . $charset, $username, $password);

    // Ustaw opcję raportowania błędów PDO na Exception
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Przygotuj zapytanie SQL do wstawienia wartości zmiennej wynik do bazy danych
    $sql = "INSERT INTO `score` (`creation_time`, `modification_time`, `deleted`, `game_id`, `player_id`, `value`) VALUES ('0000-00-00 00:00:00', CURRENT_TIMESTAMP(), 0, :game_id, 1, :wynik)";

    // Utwórz obiekt zapytania i przypisz wartość zmiennej wynik i game_id
    $stmt = $dbh->prepare($sql);
    $stmt->bindParam(':wynik', $wynik);
    $stmt->bindParam(':game_id', $game_id);
    // Wykonaj zapytanie
    $stmt->execute();

    echo 'Wartość zmiennej wynik została zapisana w bazie danych.';
} catch (PDOException $e) {
    echo 'Błąd zapisu wartości zmiennej wynik: ' . $e->getMessage();
}

