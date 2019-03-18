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
</body>
</html>
