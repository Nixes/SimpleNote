<?php
namespace SimpleNote\Repositories;

use SimpleNote\Models\Note;

include __DIR__.'../../user_validate.php';

class NoteRepository {
    private $conn;
    public function construct(\PDO $conn) {
        $this->conn = $conn;
    }

    public function insertNote (Note $note) {

            $note = mysqli_escape_string($conn,  filterNoteContents($_POST["note"]) );
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


    public function getNotesElementNo($conn,$Request_Elements) {
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

    public function getNotesPage($conn,$LastGroupNo, $Page) {
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

    public function removeNote($conn, $noteNo) {
        if ( $noteQuery = mysqli_query($conn, "DELETE FROM `notes` WHERE noteNo=$noteNo") ) {
            echo "ok";
        } else {
            echo "failed";
        }
    }

    public function checkUpdates($conn, $noteNo) {
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

    public function updateNote ($conn,$noteNo) {
        if (
            ( isset($_POST["note"]) and $_POST["note"] != "" ) and
            ( isset($_POST["noteNo"]) and $_POST["noteNo"] != "" and ctype_digit($_POST["noteNo"]) )
        ) {
            $noteNo = $_POST["noteNo"];
            $note = mysqli_escape_string($conn, filterNoteContents($_POST["note"]) );
            if ( $noteQuery = mysqli_query($conn, "UPDATE `notes` SET note='$note' WHERE noteNo=$noteNo") ) {
                echo "ok";
            } else {
                echo "failed - updating";
            }
        } else {
            echo "failed - validation";
        }
    }
}
?>
