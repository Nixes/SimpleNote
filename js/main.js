// number of pixels to leave between end of last page of notes and the next to fetch, depends on time required to get next page and user scroll velocity
var pixelBufferFetch = 200;

var notes = {
  notesPerRequest: 15,
  currentPage: 0,
  status: 0,
  note: [],
  getXmlhttp: function () {
      if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        return new XMLHttpRequest();
      }
      else {
        // code for IE6, IE5
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
  },

  remove: function (nodeToRemove) {
      var nodeToRemoveId = nodeToRemove.getAttribute('id');
        var r = confirm("Remove note?");
        if (r === true) {
            var note = document.getElementById("noteContent").value;
            var xmlhttp = notes.getXmlhttp();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log("Note remove was: " + xmlhttp.responseText);
                    if (xmlhttp.responseText == "ok") {
                        //nodeToRemove.style.backgroundColor = 'rgb(208, 117, 117)';
                        for (i = 0; i < notes.note.length; i++) {
                            if (notes.note[i][1] == nodeToRemoveId) {
                                console.log("note removed from local array");
                                notes.note.splice(i, 1);
                            }
                        }
                        // this has some compatability issues with older browsers
                        nodeToRemove.remove();

                        // now need to reflow the existing items
                        msnry.reloadItems();
                        msnry.layout();
                    }
                }
            };
            xmlhttp.open("POST", "noteQuery.php", true);

            // provides information in header telling sever that this request is from a form
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("notesRequest_Type=remove&noteNo=" + nodeToRemoveId);
        }
  },

  parser: function (noteContent) {
    // linkify note content
    // http://, https://, ftp://
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
    // from https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
    var tmp = noteContent
        .replace(urlPattern, '<a href="$&">$&</a>')
        .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
        .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    tmp = tmp.replace(/[\n\r]/g, '<br />'); // converts newlines to standard html line breaks

    return tmp;
  },

  /* attempt to send updated note to server */
  save: function (noteToEdit) {
    var nodeToRemoveId = noteToEdit.getAttribute('id');
    var note = noteToEdit.childNodes[0].textContent; // first child contains the text
    var xmlhttp = this.getXmlhttp();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if (xmlhttp.responseText == "ok") {
          console.log("Note was sucessfully saved");
        } else {
          console.log("Error updating note: " + xmlhttp.responseText);
        }
      }
    };
    xmlhttp.open("POST", "noteQuery.php", true);

    // provides information in header telling sever that this request is from a form
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("notesRequest_Type=update&noteNo=" + nodeToRemoveId + "&note=" + note );
    console.log("notesRequest_Type=update&noteNo=" + nodeToRemoveId + "&note=" + note );

    this.disableEdit(noteToEdit);
  },

  /* this cancels an edit operation */
  cancel: function (noteToEdit) {
    this.disableEdit(noteToEdit);
  },

  /* this cleans up after an edit operation */
  disableEdit: function (noteToEdit) {
    hideDim();
    noteToEdit.childNodes[0].contentEditable = false;
    noteToEdit.childNodes[0].blur();

    // hide editbar and show buttonbar
    noteToEdit.childNodes[1].style.display = "block";
    noteToEdit.childNodes[2].style.display = "none";

    noteToEdit.style.zIndex = "auto";

    // reflow now that returning to normal view
    msnry.layout();
  },

  /* this initiates an edit operation */
  enableEdit: function (noteToEdit) {
    showDim();
    noteToEdit.childNodes[0].contentEditable = true;
    noteToEdit.childNodes[0].focus();

    // hide normal buttonbar and show editbar
    noteToEdit.childNodes[1].style.display = "none";
    noteToEdit.childNodes[2].style.display = "block";

    // set z-index so that when the box outgrows its confines, we can still see
    // what we are writing
    noteToEdit.style.zIndex = "100";
  },

  /* this is where new notes are added to the DOM */
  display: function (pageNotes) {
    for (i=0;i< pageNotes.length; i++) {
      var newNote = document.createElement('div');
      newNote.setAttribute('class','note');
      newNote.setAttribute('id',pageNotes[i][1]); // set id to note number

      var noteContent = document.createElement('div');
      noteContent.className = "notecontent";
      noteContent.innerHTML = this.parser(pageNotes[i][0]);


      var buttonBar = document.createElement('div');
      buttonBar.className = "buttonbar";

      var editButton = document.createElement('button');
      editButton.textContent = "edit";
      editButton.className = "edit";
      editButton.onclick = function (e) {
        console.log("Edit button clicked from note: "+e.target.parentNode.parentNode.getAttribute('id'));
        notes.enableEdit(e.target.parentNode.parentNode);
      };

      var deleteButton = document.createElement('button');
      deleteButton.textContent = "del";
      deleteButton.className = "delete";
      deleteButton.onclick = function (e) {
        console.log("Delete button clicked from note: "+e.target.parentNode.parentNode.getAttribute('id'));
        notes.remove(e.target.parentNode.parentNode);
      };

      var clearfloat1 = document.createElement('div');
      clearfloat1.className = "clearfloat";

      buttonBar.appendChild(editButton);
      buttonBar.appendChild(deleteButton);
      buttonBar.appendChild(clearfloat1);


      var editButtonBar = document.createElement('div');
      editButtonBar.className = "buttonbar editbar";

      var saveButton = document.createElement('button');
      saveButton.textContent = "save";
      saveButton.className = "save";
      saveButton.onclick = function (e) {
        console.log("Save button pressed: "+e.target.parentNode.parentNode.getAttribute('id'));
        notes.save(e.target.parentNode.parentNode);
      };

      var cancelButton = document.createElement('button');
      cancelButton.textContent = "cancel";
      cancelButton.className = "cancel";
      cancelButton.onclick = function (e) {
        console.log("Cancel button pressed: "+e.target.parentNode.parentNode.getAttribute('id'));
        notes.cancel(e.target.parentNode.parentNode);
      };

      var clearfloat2 = document.createElement('div');
      clearfloat2.className = "clearfloat";

      editButtonBar.appendChild(saveButton);
      editButtonBar.appendChild(cancelButton);
      editButtonBar.appendChild(clearfloat2);


      newNote.appendChild(noteContent);
      newNote.appendChild(buttonBar);
      newNote.appendChild(editButtonBar);
      document.getElementById('notes').appendChild(newNote);

      msnry.reloadItems();
      msnry.layout();
    }
  },

  // function to check for updates, check to see if there are any notes with a higher ID number than we currently have
  // if there are, they will be returned like a normal page request
  update: function () {
      var xmlhttp = notes.getXmlhttp();
      xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        //console.log("Raw Data Recieved Was: " +xmlhttp.responseText);
        pageNotes = JSON.parse(xmlhttp.responseText);
        display(pageNotes);
        }
      };

    xmlhttp.open("POST","noteQuery.php",true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("notesRequest_Type=checkupdate&notesRequest_CheckNotes=" + Page);
  },

  add: function () {
      note = document.getElementById("noteContent").value;
      var xmlhttp = notes.getXmlhttp();
    xmlhttp.open("POST","noteQuery.php",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("notesRequest_Type=add&note=" + note);
  },

  getPage: function () {
      var xmlhttp = notes.getXmlhttp();
      this.changePageStatus(1);
      xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              console.log("Raw Data Recieved Was: " + xmlhttp.responseText);
              pageNotes = JSON.parse(xmlhttp.responseText);
              if (pageNotes.length > 0) { // check to see if empty
                  console.log("notes.length was: " + pageNotes.length);
                  notes.note = notes.note.concat(pageNotes);
                  notes.display(pageNotes);
                  notes.currentPage++;
              }
              notes.changePageStatus(0);
          }
      };
    xmlhttp.open("POST","noteQuery.php",true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("notesRequest_Type=page&notesRequest_LastGroupNo="+this.notesPerRequest+"&noteRequest_Page=" + this.currentPage);
  },

  changePageStatus: function (setStatus) {
    // a bunch of status's defined by a number here
    var statusString = "";
    switch (setStatus) {
      case 0:
        statusString = "idle";
        this.status = 0;
        break;
      case 1:
        statusString = "updating";
        this.status = 1;
        break;
    }
  }
};


// this function has historically had issues with mobile browsers
function checkScroll () {
  // compatibility boilerplate
  var body = document.body,html = document.documentElement;
  var documentHeight = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

  //console.log( "window.pageYOffset: " + window.pageYOffset + " documentHeight " + documentHeight + " window.innerHeight: " + window.innerHeight ); // debugness
  if ( window.pageYOffset + window.innerHeight > (documentHeight - pixelBufferFetch)  & notes.status === 0) { // was if ( window.pageYOffset + window.innerHeight > (documentHeight - 50)  & notes.status == 0) {
    notes.getPage();
  }
}

// this function calls getPage until the current page is full
function fillPage () {
    // compatability boilerplate
    var body = document.body;
    var html = document.documentElement;
    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

    if ((window.innerHeight + pixelBufferFetch) > documentHeight) {
      // simple blocking system, prevents notes from loading in wrong order TODO: FIX. This may have issues when scrolling too fast, we may need some kind of queuing system
      if (notes.status === 0) {
        console.log("A page was requested during filling");
        notes.getPage();
      }
    } else {
      console.log("Determined page was full");
      clearInterval(pagefiller);
    }
}

function showDim() {
  var dim = document.getElementById("dim");
  dim.style.display = "block";
}
function hideDim() {
  var dim = document.getElementById("dim");
  dim.style.display = "none";
}

function showAddNote () {
  showDim();
  var addNoteElement = document.getElementById("add_note");
  addNoteElement.style.display = "block";
  document.getElementById("noteContent").focus();
}
function hideAddNote () {
  hideDim();
  var addNoteElement = document.getElementById("add_note");
  document.getElementById("noteContent").blur();
  addNoteElement.style.display = "none";
}

function initMasonry () {
  var elem = document.querySelector('#notes');
  var msnry = new Masonry( elem, {
    // options
    transitionDuration: 0,
    gutter: 10,
    itemSelector: '.note',
    columnWidth: 200
  });
  return msnry;
}

function init () {
  msnry = initMasonry();
  pagefiller = setInterval(fillPage,500);

  window.onscroll = checkScroll;
  // a touchmove event on mobile devices may be a good alternative
}
window.onload = init;
