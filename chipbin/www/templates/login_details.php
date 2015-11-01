
<?php
$ack = array();
require_once __DIR__ . '/db_connect.php';
$db = new DB_CONNECT();
if(!$db) {
    echo("Error connecting to the database....");
    exit();
}



$name=$_GET['name'];




$query = "SELECT * FROM `userinfo` where UserEmailID='$name'";


$response = mysql_query($query) or die(mysql_error());

 
while ($row = mysql_fetch_array($response, MYSQL_ASSOC)) {
   $role = $row["Role"];
     array_push($ack, "$role");
   
}

header('Content-Type: application/json');
echo json_encode($ack);
?> 




