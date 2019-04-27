<?php
require (__DIR__.'/settings.php');
$dsn = "mysql:dbname=".$sql_db.";host=".$host;
$connection = new \PDO($dsn,$user,$pwd);

require 'vendor/autoload.php';

use SimpleNote\Repositories\NoteRepository;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$noteRepository = new NoteRepository($connection);
$noteController = new \SimpleNote\Controllers\NoteController($noteRepository);

// Create and configure Slim app
$config = ['settings' => [
    'addContentLengthHeader' => false,
	'displayErrorDetails' => true,
]];
$app = new \Slim\App($config);

// Define app routes
$app->put('/notes/{id}', [$noteController, 'insertNote']);

// Run app
$app->run();

// request summary model
// need type of request, notesRequest_Type = page, notesRequest_Type = elementno
// need elements requested, notesRequest_Elements[noelements] = {1,2,3,4,5,6,7} or just 1
// need last 20 elements, notesRequest_LastGroupNo = 20 (no notes per page), noteRequest_LastNo = 1 (no of page to request), allows dymanic loading on scrolling

//if ( isset ( $_POST["notesRequest_Type"]) ) {
//    if ($_POST["notesRequest_Type"] == "page") {
//        if (ctype_digit($_POST["notesRequest_LastGroupNo"]) && ctype_digit($_POST["noteRequest_Page"]) ) {
//            getNotesPage($conn,$_POST["notesRequest_LastGroupNo"], $_POST["noteRequest_Page"] );
//        }
//    }
//    else if ($_POST["notesRequest_Type"] == "remove") {
//        if ( ctype_digit($_POST["noteNo"]) ) {
//            removeNote($conn, $_POST["noteNo"] );
//        }
//    }
//    else if ($_POST["notesRequest_Type"] == "elementno") {
//        if ( ctype_digit($_POST["notesRequest_Elements"]) ) {
//            getNotesElementNo($conn, $_POST["notesRequest_Elements"] );
//        }
//    }
//    else if ($_POST["notesRequest_Type"] == "checkupdate") {
//        checkUpdates($conn, $_POST["notesRequest_CheckNotes"] );
//    }
//    else if ($_POST["notesRequest_Type"] == "add") {
//        insertNote($conn);
//    }
//    else if ($_POST["notesRequest_Type"] == "update") {
//        updateNote($conn);
//    }
//}