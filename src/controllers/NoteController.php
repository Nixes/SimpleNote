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

    public function getAll(Request $request, Response $response) {
		try {
			$queryParams = $request->getQueryParams();
			$pageSize = $queryParams['pageSize'];
			$page = $queryParams['page'];
			$notes = $this->noteRepository->getNotesPage($pageSize,$page);
			return $this->successAPIResponse($response,$notes);
		} catch (\Exception $error) {
			return $this->errorAPIResponse($response,$error);
		}
    }

    public function insertNote(Request $request, Response $response, array $args) {
        $body = $request->getParsedBody();
		$content = $body["content"];
        if (empty($content )) {
        	throw new Exception("Notes cannot be empty");
		}
        $note = new Note();
        $note->setContent($content );
        $note = $this->noteRepository->insertNote($note);
        return $this->successAPIResponse($response,$note);
	}

    public function updateNote(Request $request, Response $response, array $args) {
        $body = $request->getParsedBody();
		$content = $body["content"];
		$noteId = $args['noteId'];
        if (empty($content )) {
        	throw new Exception("Notes cannot be empty");
		}
        $note = new Note();
        $note->setContent($content);
        $note->setId($noteId);
        $note = $this->noteRepository->updateNote($note);
        return $this->successAPIResponse($response,$note);
	}


	public function removeNote(Request $request, Response $response, array $args) {
    	try {
			$noteId = $args['noteId'];
			$this->noteRepository->removeNote($noteId);
			return $this->successAPIResponse($response, array( 'count'=>1));
		} catch (\Exception $error) {
			return $this->errorAPIResponse($response,$error);
		}
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