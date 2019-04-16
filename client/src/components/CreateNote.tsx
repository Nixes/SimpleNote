import React, { Component } from 'react';
import Masonry from 'react-masonry-component';

class CreateNote extends Component {
  showDim() {
    // const dim = document.getElementById("dim");
    // dim.style.display = "block";
  }
  hideDim() {
    // const dim = document.getElementById("dim");
    // dim.style.display = "none";
  }

  getXmlhttp () {
      return new XMLHttpRequest();
  }


  add() {
    let noteContentElem = document.getElementById("noteContent")  as HTMLInputElement;
    if (noteContentElem) {
      let noteContent = noteContentElem.value;
      const xmlhttp = this.getXmlhttp();
      xmlhttp.open("POST","noteQuery.php",true);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send("notesRequest_Type=add&note=" + noteContent);
    }
  }

  hideAddNote (evt:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.hideDim();

    // remove focus from note content form
    let noteContentElement = document.getElementById("noteContent");
    if (noteContentElement) {
      noteContentElement.blur();
    }
    // hide note content form
    let addNoteElement = document.getElementById("add_note");
    if (addNoteElement) {
      addNoteElement.style.display = "none";
    }
  }

  showAddNote () {
    this.showDim();
    let addNoteElement = document.getElementById("add_note");
    let noteContentElem = document.getElementById("noteContent");
    if (addNoteElement) {
		addNoteElement.style.display = "block";
		if (noteContentElem) {
			noteContentElem.focus();
		}
	}
  }

  render() {
    return (
        <div id="createNoteComponent">
          <div id="add_note">
            <form onSubmit={this.add}>
              <textarea rows={1} id="noteContent"></textarea>
              <button type="submit">add</button>
              <button type="reset" id="cancel" onClick={this.hideAddNote}>cancel</button>
            </form>
          </div>
          <button id = "addnotebutton" onClick = {this.showAddNote} > addnote </button>
        </div>
    );
  }
}

export default CreateNote;
