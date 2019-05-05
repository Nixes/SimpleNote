<?php
namespace SimpleNote\Repositories;

use SimpleNote\Models\Note;
use PDOException;
use Exception;
use \PDO;

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
        $query = "CREATE TABLE `notes` (
				  `note` varchar(10000) NOT NULL,
				  `noteNo` int(11) NOT NULL AUTO_INCREMENT,
				  PRIMARY KEY (`noteNo`),
				  UNIQUE KEY `noteNo` (`noteNo`)
				) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;";
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

    public function insertNote (Note $note): Note {
        try {
            $sql = "INSERT INTO notes (note) VALUES(:content); ";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(array(
                ":content" => $note->getContent(),
            ));

            if ($stmt->errorCode() != '0000') {
                throw new Exception($stmt->errorInfo()[2]);
            }

            $note->setId($this->pdo->lastInsertId());
            return $note;
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

    public function getNotesPage(int $pageSize, int $Page):array {
		$results = [];
		$offset = $pageSize * $Page;
		// go here http://use-the-index-luke.com/sql/partial-results/fetch-next-page for more efficient methods, the
		// current way of doing it is bad in the long term as the query time will exponentially increase with page number
		$sql =  "SELECT * FROM notes ORDER BY notes.noteNo DESC LIMIT :pageSize OFFSET :offset;";
		try {
			$stmt = $this->pdo->prepare($sql);
			// have to manually bind to set types to integer, since LIMIT doesn't perform type coercion
			// unlike everything else in MYSQL
			$stmt->bindParam(":pageSize",$pageSize, PDO::PARAM_INT);
			$stmt->bindParam(":offset",$offset, PDO::PARAM_INT);
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

	/**
	 * @param int $noteNo
	 * @throws Exception
	 */
    public function removeNote(int $noteNo) {
		$query = "DELETE FROM `notes` WHERE noteNo= :noteNo;";
		try {
			$stmt = $this->pdo->prepare($query);
			$stmt->execute(array(
				":noteNo" => $noteNo
			));

			if ($stmt->errorCode() != '0000') {
				throw new Exception($stmt->errorInfo()[2]);
			}

			if(!$stmt->rowCount()) {
				throw new Exception("Failed to delete row");
			}
		} catch (PDOException $e) {
			throw new Exception($e->getMessage());
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

    public function updateNote (Note $note) {
            $query =  "UPDATE `notes` SET note=:content WHERE noteNo=:noteId";

            try {
                $stmt = $this->pdo->prepare($query);
                $stmt->execute(array(
                    ":noteId" => $note->getId(),
                    ":content" => $note->getContent(),
                ));

                if ($stmt->errorCode() != '0000') {
                    throw new Exception($stmt->errorInfo()[2]);
                }
            } catch (PDOException $e) {
                throw new Exception($e->getMessage());
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
