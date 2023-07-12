    <?php
    include('credentials.php');

    header('Access-Control-Allow-Origin: *');

    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $pdo = new PDO($dsn, $user, $password, $options);
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        $type = $data['type'];
        if($type === 'getMaxIdGame'){

            $toSendData = getMaxIdGame($pdo);
            $arrayResult = array('id' => $toSendData['id']);

            die(json_encode($arrayResult, true));
        }

        if($type === 'getGameData'){
            $id = $data['id'];

            if(!is_integer($id)){
                die("Wystąpił błąd");
            }
            if(!getDeletedGames($pdo,$id)){
                $reviewsAmount = getSumOfReviews($pdo, $id);
                $reviews= getCountReviews($pdo, $id);
                $toSendData = getGameData($pdo, $id);
    
                $arrayResult = array('id' => $toSendData['id'], 'game_name' => $toSendData['game_name'], 'game_description' => $toSendData['game_description'], 'screenshot' => $toSendData['screenshot'], 'platform_name' => $toSendData['platform_name'], 'platform_description' => $toSendData['platform_description'], 'type_name' => $toSendData['type_name'], 'reviewsAmount' => $reviewsAmount, 'reviews' => $reviews);
                die(json_encode($arrayResult, true));
            }
            $arrayResult = array('idn' => $data['id']);
           die(json_encode($arrayResult, true));
        }

        if($type === 'newGameData'){
            $id = $data['id'];
            $id = $id+1;
            $dataToSend = insertNewGameIntoDatabase($pdo, $data,$id);
            
            if(!checkReview($pdo, $data)){
                die(addGameReview($pdo, $data));
            }
            $dataToSend = editGameReview($pdo, $data);
            die(json_encode($dataToSend, true));
        }
        if($type === 'getMaxDeletedGames'){
            $dataToSend = getMaxDeletedGames($pdo);
            $arrayResult = array('idnMax' => $dataToSend['id']);
           die(json_encode($arrayResult, true));
        }
        if($type === 'editGameData'){

            $dataToSend = editGameData($pdo, $data);
            if(!checkReview($pdo, $data)){
                die(addGameReview($pdo, $data));
            }
            $dataToSend = editGameReview($pdo, $data);
            die(json_encode($dataToSend, true));
        }

        if($type === 'getIdFromName'){
            $name = $data['name'];
            if(!is_string($name)){
                die("Wystapil blad");
            }
            $id = getIdFromName($pdo, $name);
            $arrayResult = array('id' => $id['id']);
            die(json_encode($arrayResult, true));
            
        }

        if($type === 'getAuthorId'){
            $id = $data['id'];

            if(!is_integer($id)){
                die("Wystąpił błąd");
            }
            $dataToSend = getAuthorId($pdo, $id);
            $arrayResult = array('author_id' => $dataToSend['author_id']);
            die(json_encode($arrayResult, true));
        }

        if($type === 'deleteGame'){
            $id = $data['id'];

            if(!is_integer($id)){
                die("Wystąpił błąd");
            }
            $dataToSend = deleteGame($pdo,$id);
            die(json_encode($dataToSend, true));
        }
    }
    function getGameData($pdo, $id) {
        $stmt = $pdo->prepare("SELECT game.id, game.name AS game_name, game.description AS game_description, game.screenshot, game_platform.name AS platform_name, game_platform.description AS platform_description, game_type.name AS type_name FROM game, game_platform, game_type WHERE game.id=? AND game.deleted!=1;");
        $stmt->execute(array($id));
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getMaxIdGame($pdo) {
        $stmt = $pdo->prepare("SELECT id FROM game ORDER BY id DESC LIMIT 1");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function insertNewGameIntoDatabase($pdo,$data,$id){
        $stmt = $pdo->prepare("INSERT INTO game (id, author_id, game_platform_id, game_type_id, creation_time, modification_time,deleted,name,description,screenshot) VALUES (?, ?, ?,?,'0000-00-00 00:00:00', CURRENT_TIMESTAMP(), 0, ?, ?, ?);");
        $stmt->execute([$id,$data['player_id'], $data['platform'], $data['category'], $data['name'], $data['description'], $data['screenshot']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function editGameData($pdo,$data){
        $stmt = $pdo->prepare("UPDATE game SET author_id = ?, game_platform_id = ?, game_type_id = ?, creation_time = '0000-00-00 00:00:00', modification_time = CURRENT_TIMESTAMP(), deleted = 0, name = ?, description = ?, screenshot = ? Where id =?;  ");
        $stmt->execute([$data['author_id'],$data['platform'],$data['category'],$data['name'],$data['description'],$data['screenshot'],$data['id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getIdFromName($pdo, $name){
        $stmt = $pdo->prepare("SELECT id FROM game Where name=?;");
        $stmt->execute([$name]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getAuthorId($pdo, $name){
        $stmt = $pdo->prepare("SELECT author_id FROM game Where id=?;");
        $stmt->execute([$name]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function checkReview($pdo, $data){
        $stmt = $pdo->prepare("SELECT * FROM game_rating WHERE game_id=? AND player_id=?;");
        $stmt->execute([$data['id'],$data['player_id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function editGameReview($pdo, $data){
        $stmt = $pdo->prepare("UPDATE game_rating SET rating=? Where game_id=? AND player_id =?;");
        $stmt->execute([$data['rating'], $data['id'], $data['player_id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function addGameReview($pdo, $data){
        $stmt = $pdo->prepare("INSERT INTO game_rating (game_id, player_id, rating) VALUES (?,?,?);");
        $stmt->execute([$data['id'], $data['player_id'], $data['rating']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getCountReviews($pdo, $id){
        $stmt = $pdo->prepare("SELECT COUNT(game_id) as amountReviews FROM game_rating WHERE game_id =?;");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getSumOfReviews($pdo, $id){
        $stmt = $pdo->prepare("SELECT SUM(rating) as sumReviews FROM game_rating WHERE game_id =?;");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getDeletedGames($pdo,$id){
        $stmt = $pdo->prepare("SELECT id FROM game WHERE deleted=1 AND id=?;");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function deleteGame($pdo,$id){
        $stmt = $pdo->prepare("UPDATE game SET deleted=1 Where id=?;");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getMaxDeletedGames($pdo){
        $stmt = $pdo->prepare("SELECT Count(id) AS id FROM game WHERE deleted=1;");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    