<?php
include __DIR__.'../../user_validate.php';
require_once (__DIR__.'../../settings.php');

$conn = @mysqli_connect($host,
  $user,
  $pwd,
  $db
) or die("<p>The application failed to connect to the database server</p>");

function insertNote ($conn) {
  if ( isset ( $_POST["note"]) and $_POST["note"] != ""  ) {
    $note = mysqli_escape_string($conn,  $_POST["note"] );
    $noteNoQuery = mysqli_query($conn, "SELECT MAX(noteNo) FROM notes;"); // note number is maximum note number plus one
    $noteNoResult = mysqli_fetch_row($noteNoQuery);
    $noteNo =  $noteNoResult[0] + 1;
    //echo "<p> {$noteNo} </p>" ;
    $insertQuery = "INSERT INTO notes VALUES(
                                    '$note',
                                    '$noteNo'
                                    ); ";
    $insertData = mysqli_query($conn, $insertQuery);
  }
}

function getNotesElementNo($conn,$Request_Elements) {
  $ResultNotes = array();
  for ($i=0; $i < sizeof($Request_Elements); $i++) {
    if ( $noteQuery = mysqli_query($conn, "SELECT * FROM `notes` WHERE noteNo=$Request_Elements[$i]") ) {
      while ($note = mysqli_fetch_row($noteQuery) ) {
          //echo '$note[0]','$note[1]' ;
          $ResultNotes[$i] = $note;
      };
    };
  }
  echo $ResultNotes;
}

function getNotesPage($conn,$LastGroupNo, $Page) {
  $ResultNotes = array();
  $offset = $LastGroupNo * $Page;
  if ( $noteQuery = mysqli_query($conn, "SELECT * FROM `notes` ORDER BY `notes`.`noteNo` DESC LIMIT $LastGroupNo OFFSET $offset;") ) { // go here http://use-the-index-luke.com/sql/partial-results/fetch-next-page for more efficient methods, the current way of doing it is bad in the long term as the query time will exponentially increase with page number
    $i = 0;
    while ($note = mysqli_fetch_row($noteQuery) ) {
      $ResultNotes[$i] = $note;
      $i++;
    };
  };
  echo json_encode($ResultNotes);
}

function removeNote($conn, $noteNo) {
  if ( $noteQuery = mysqli_query($conn, "DELETE FROM `notes` WHERE noteNo=$noteNo") ) {
    echo "ok";
  } else {
    echo "failed";
  }
}

function checkUpdates($conn, $noteNo) {
    $ResultNotes = array();
    if ( $noteQuery = mysqli_query($conn, "SELECT * FROM `notes` WHERE noteNo > $noteNo ORDER BY `notes`.`noteNo` DESC;") ) { // go here http://use-the-index-luke.com/sql/partial-results/fetch-next-page for more efficient methods, the current way of doing it is bad in the long term as the query time will exponentially increase with page number, or another method may include caching the whole query and just pulling from storage
        while ($note = mysqli_fetch_row($noteQuery) ) {
            $ResultNotes[] = $note;
        };
    };
    if (sizeof($ResultNotes) < 1) {
        echo json_encode(false);
    } else {
        echo json_encode($ResultNotes);
    }
}

function updateNote ($conn,$noteNo) {
  if (
  ( isset($_POST["note"]) and $_POST["note"] != "" ) and
  ( isset($_POST["noteNo"]) and $_POST["noteNo"] != "" and ctype_digit($_POST["noteNo"]) )
  ) {

    $note = mysqli_escape_string($conn,  $_POST["note"] );
    $noteNo = $_POST["noteNo"];
    if ( $noteQuery = mysqli_query($conn, "UPDATE `notes` SET note=$note WHERE noteNo=$noteNo") ) {
        echo "ok";
    } else {
        echo "failed";
    }
  } else {
    echo "failed";
  }
}

// request summary model
// need type of request, notesRequest_Type = page, notesRequest_Type = elementno
// need elements requested, notesRequest_Elements[noelements] = {1,2,3,4,5,6,7} or just 1
// need last 20 elements, notesRequest_LastGroupNo = 20 (no notes per page), noteRequest_LastNo = 1 (no of page to request), allows dymanic loading on scrolling

if ( isset ( $_POST["notesRequest_Type"]) ) {
    if ($_POST["notesRequest_Type"] == "page") {
      if (ctype_digit($_POST["notesRequest_LastGroupNo"]) && ctype_digit($_POST["noteRequest_Page"]) ) {
        getNotesPage($conn,$_POST["notesRequest_LastGroupNo"], $_POST["noteRequest_Page"] );
      }
    }
    else if ($_POST["notesRequest_Type"] == "remove") {
      if ( ctype_digit($_POST["noteNo"]) ) {
        removeNote($conn, $_POST["noteNo"] );
      }
    }
    else if ($_POST["notesRequest_Type"] == "elementno") {
      if ( ctype_digit($_POST["notesRequest_Elements"]) ) {
        getNotesElementNo($conn, $_POST["notesRequest_Elements"] );
      }
    }
    else if ($_POST["notesRequest_Type"] == "checkupdate") {
      checkUpdates($conn, $_POST["notesRequest_CheckNotes"] );
    }
    else if ($_POST["notesRequest_Type"] == "add") {
      insertNote($conn);
    }
    else if ($_POST["notesRequest_Type"] == "update") {
      updateNote($conn);
    }
}
?>
