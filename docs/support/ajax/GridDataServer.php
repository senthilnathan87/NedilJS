<?php

$filepath = realpath (dirname(__FILE__));

include_once($filepath."/../../backend/validate.php");
include_once($filepath."/../../backend/db.php");

$success = false;
$error = false;

	header('Content-type: application/json');
	
if ($_SERVER["REQUEST_METHOD"] == "GET") {

		$valid = new Validator();
		
		$co = new DBConnector();
		$con = $co->getConnection();

		
		$result = mysqli_query($con,"SELECT * FROM ajax_grid");	
		$success = true;
		
		echo "{ \"NedilResponse\" : [";
		
		$str = "";
		while($row = mysqli_fetch_array($result)) {
		  $str .=  "{ \"key\" : \"".$row['sno']."\",\"S.No\" : \"".$row['sno']."\",\"Name\" : \"".$row['name']."\",\"Age\" : \"".$row['age']."\",\"Phone Number\" : \"".$row['phoneno']."\"},";
		}
		$str = rtrim($str, ",");
		echo $str;
		echo "], \"page\" : 1,";
		echo " \"total\" : 2";
		echo "}";
		
		$co->killConnection();		
}	

?>