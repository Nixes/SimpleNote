<!DOCTYPE html>
<html lang="en">
<head>
		<title>Simple notes</title>
		<link rel="stylesheet" type="text/css" href="styles/main.css">
		<script src="./js/main.js"></script>
</head>

<body>

<div id="top_bar">
	<div id="top_bar_sub">
		<div id="add_note">
			<form onsubmit="notes.add()">
				<textarea  rows="1" id="noteContent" cols="46"></textarea>
				<button type="submit">add</button>
			</form>
		</div>
		<div id="status"></div>
</div>
	<div class="clearfloat"></div>
</div>

<div id="notes">
</div>
<?php
// load settings file
require_once ("settings.php");
	$conn = @mysqli_connect($host,
	$user,
	$pwd,
	$sql_db
) or die("<p>The application failed to connect to the database server</p>");

// check if notes table exists, if not create it
$result = mysqli_query($conn, "SELECT * FROM notes;");
if ($result !== FALSE) {
} else {
	echo "Table does not exist, it is being created.";
	mysqli_query($conn, "CREATE TABLE notes ( 
										note Varchar(10000),
										noteNo Int unique
										); " ); // use of int to store note number has downside of only allowing maximum of 2147483647 possible notes, must be unique to prevent collisions
}
?>
</body>
</html>