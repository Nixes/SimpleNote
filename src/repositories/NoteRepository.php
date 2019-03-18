<?php
namespace SimpleNote\Repositories;

use SimpleNote\Models\Note;
use PDOException;
use Exception;


class NoteRepository {
    /**
     * @var \PDO
     */
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function checkTableExists() {
        $query = "SELECT * FROM notes;";
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();

            if ($stmt->errorCode() != '0000') {
                throw new Exception($stmt->errorInfo()[2]);
            }

            if (!($row = $stmt->fetch(PDO::FETCH_ASSOC))) {
                return false;
            }

            return true;
        } catch (PDOException $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function createTable() {
        $query = "CREATE TABLE notes (note Varchar(10000),noteNo Int unique); ";
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();

            if ($stmt->errorCode() != '0000') {
                throw new Exception($stmt->errorInfo()[2]);
            }

            if (!($row = $stmt->fetch(PDO::FETCH_ASSOC))) {
                return false;
            }

            return true;
        } catch (PDOException $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function createTableIfNotExist() {
        $createdTable = false;
        // check if notes table exists, if not create it
        if ($this->checkTableExists() == false) {
            $this->createTable();
            $createdTable = true;
        }
        return $createdTable;
    }

    public function insertNote (Note $note) {
        try {
            $sql = "INSERT INTO notes (note) VALUES(:content); ";

            $stmt = $this->dbh->prepare($sql);
            $stmt->execute(array(
                ":noteNo" => $note->getId(),
                ":note" => $note->getContent(),
            ));

            if ($stmt->errorCode() != '0000') {
                throw new Exception($stmt->errorInfo()[2]);
            }

        } catch (PDOException $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @param array $noteIds
     * @return Note[]
     * @throws Exception
     */
    public function findForIds(array $noteIds) {
        $results = array();
        $noteIdsString = implode(',',$noteIds);
        $query = "SELECT * FROM `notes` WHERE noteNo in (".$noteIdsString.")";
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute();

            if ($stmt->errorCode() != '0000') {
                throw new Exception($stmt->errorInfo()[2]);
            }

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $results[] = self::build($row);
            }

            return $results;
        } catch (PDOException $e) {
            throw new Exception($e->getMessage());
        }
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

    /**
     * @param array $row
     * @return Note
     */
    static public function build(array $row) {
        $note = new Note();
        $note->setContent($row['note']);
        $note->setId($row['noteNo']);
        return $note;
    }
}
?>
