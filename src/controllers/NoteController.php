<?php

namespace SimpleNote\Controllers;

use SimpleNote\Repositories\NoteRepository;
use Symfony\Component\HttpFoundation\Request;

class NoteController {
    public function constructor (NoteRepository $noteRepository) {
        private function insertNote(Request $request) {

            if ( isset ( $_POST["note"]) and $_POST["note"] != ""  ) {

            }
        }
    }
}