<?php

if(isset($_GET["example"])) {
	if($_GET["example"] == "1") {
		echo "Hi ".$_GET["name"].",<br/>";
		echo "Your age is ".$_GET["age"]."<br/>";
	} else if($_GET["example"] == "2") {
		header('Content-type: application/xml');
		echo "<info>";
		echo "<name>".$_GET["name"]."</name>";
		echo "<age>".$_GET["age"]."</age>";
		echo "</info>";
	} else if($_GET["example"] == "3") {
		header('Content-type: application/json');
		echo "{";
		echo "\"name\" : \"".$_GET["name"]."\",";
		echo "\"age\" : \"".$_GET["age"]."\"";
		echo "}";
	} else if($_GET["example"] == "4") {
		echo "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
	} else 	if($_GET["example"] == "5") {
		header('Content-type: application/json');
		$array = array('Senthilnathan','Ganesh','Rajesh','Shanmugavel','Raju','Kumar Sent','Iqbal','Viji','Vishnu');
		$fl_array = preg_grep("/^".$_GET["Users"]."/i", $array);
		$op = "";
		foreach ($fl_array as &$value) {
			$op .= "\"".$value."\",";
		}
		$op = rtrim($op, ",");
		echo "{ \"NedilResponse\" : [".$op."]}";
	}
}	else if (!empty($_POST["example"])) {


}

?>