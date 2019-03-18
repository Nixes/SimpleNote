<?php
    include __DIR__.'../../user_validate.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Simple notes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="styles/main.css">
  <script src="./js/main.js"></script>
  <script src="./js/masonry.pkgd.min.js"></script>
</head>

<body>
<div id="container">
      <div id="add_note">
        <form onsubmit="notes.add()">
          <textarea  rows="1" id="noteContent"></textarea>
          <button type="submit">add</button>
          <button type="reset" id="cancel" onclick="hideAddNote()">cancel</button>
        </form>
      </div>

  <button id="addnotebutton" onclick="showAddNote()">add note</button>

  <div id="notes">
  </div>
</div>
<div id="dim" onclick="hideDim()"></div>
<?php
include __DIR__.'../../user_validate.php';

// load settings file
require_once (__DIR__.'../../settings.php');
    $conn = @mysqli_connect($host,
    $user,
    $pwd,
    $db
) or die("<p>The application failed to connect to the database server</p>");

// check if notes table exists, if not create it
$result = mysqli_query($conn, "SELECT * FROM notes;");
if ($result == FALSE) {
    echo "<p>Table does not exist, it is being created.</p>";
    mysqli_query($conn, "CREATE TABLE notes (
                                        note Varchar(10000),
                                        noteNo Int unique
                                        ); " ); // use of int to store note number has downside of only allowing maximum of 2147483647 possible notes, must be unique to prevent collisions
}
?>
</body>
</html>
