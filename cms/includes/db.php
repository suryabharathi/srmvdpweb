<?php ob_start();

$db['db_host'] = "localhost";
$db['db_user'] = "root";
$db['db_pass'] = "root";
$db['db_name'] = "cms";

foreach($db as $key => $value){
define(strtoupper($key), $value);
}

$connection = mysqli_connect('localhost', 'root','12345','cms2');



$query = "SET NAMES utf8";
mysqli_query($connection,$query);

//if($connection) {
//
//echo "We are connected";
//
//}








?>