<?php

namespace SimpleNote\Controllers;

use mysql_xdevapi\Exception;
use SimpleNote\Models\Note;
use SimpleNote\Repositories\NoteRepository;
use \Psr\Http\Message\ServerRequestInterface as Request;
//use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\Http\Response;

class NoteController {
    /**
     * @var NoteRepository
     */
    private $noteRepository;

    public function __construct(NoteRepository $noteRepository) {
        $this->noteRepository = $noteRepository;
    }

    private function successAPIResponse(Response $response, $data) {
        $status = 200;
        return $response->withJson($data)->withStatus($status);
    }

    private function errorAPIResponse(Response $response,\Exception $e) {
        $status = 500;
        $data = array(
            "error" => $e->getMessage(),
            "errorCode" => $e->getCode(),
            "success" => false,
        );
        return $response->withJson($data)->withStatus($status);
    }

    public function getAll(Request $request, Response $response, array $args) {
		$LastGroupNo = $request->getAttribute('lastGroupNum');
		$Page = $request->getAttribute('lastGroupNum');
		echo "Last group no: ".$LastGroupNo." Page: ".$Page;
		$notes = [];
        if (!empty($content )) {
			$notes[] = $this->noteRepository->getNotesPage($LastGroupNo,$Page);
		}
		$this->successAPIResponse($response,$notes);
    }

    public function insertNote(Request $request, Response $response, array $args) {
        $body = $request->getParsedBody();
		$content = $body["content"];
        if (empty($content )) {
        	throw new Exception();
		}
        $note = new Note();
        $note->setContent($content );
        $note = $this->noteRepository->insertNote($note);
        $this->successAPIResponse($response,$note);
	}
	
    public function updateNote(Request $request, Response $response, array $args) {
        if (
            ( isset($_POST["note"]) and $_POST["note"] != "" ) and
            ( isset($_POST["noteNo"]) and $_POST["noteNo"] != "" and ctype_digit($_POST["noteNo"]) )
        ) {
            $noteNo = $_POST["noteNo"];
        }
    }

}