var pixelBufferFetch= 200 ; // number of pixels to leave between end of last page of notes and the next to fetch, depends on time required to get next page and user scroll velocity

var notes = {
    notesPerRequest: 15,
    currentPage: 0,
	status: 0,
	note: [],
	getXmlhttp: function () {
	    // boilerplate compatibility code from w3schools
	    //var xmlhttp;
	    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
	        return new XMLHttpRequest();
	    }
	    else {// code for IE6, IE5
	        return new ActiveXObject("Microsoft.XMLHTTP");
	    }
	},
	remove: function (nodeToRemove) {
	    var nodeToRemoveId = nodeToRemove.getAttribute('id');
        var r = confirm("Remove note?");
        if (r == true) {
            note = document.getElementById("noteContent").value;
            var xmlhttp = notes.getXmlhttp();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log("Note remove was: " + xmlhttp.responseText);
                    if (xmlhttp.responseText == "ok") {
                        //nodeToRemove.style.backgroundColor = 'rgb(208, 117, 117)';
                        for (i = 0; i < notes.note.length; i++) {
                            if (notes.note[i][1] == nodeToRemoveId) {
                                console.log("note removed from local array");
                                notes.note.splice(i, 1)
                            }
                        }
                        nodeToRemove.remove(); // this has come compatability issues with older browsers
                    }
                }
            }
            xmlhttp.open("POST", "noteQuery.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // provides information in header that it is a form
            xmlhttp.send("notesRequest_Type=remove&noteNo=" + nodeToRemoveId);
        }
	},
	parser: function (noteContent) { // linkify's note content
	    // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
		// wow this looks neat, from https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
        tmp = noteContent
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
        tmp = tmp.replace(/[\n\r]/g, '<br />'); // converts newlines to standard html line breaks
        
        return tmp;
	},
	display: function (pageNotes) {
		for (i=0;i< pageNotes.length; i++) {
			var newNote = document.createElement('div');
			newNote.setAttribute('class','note');
			newNote.setAttribute('id',pageNotes[i][1]); // set id to note no
			pageNotes[i][0] = this.parser(pageNotes[i][0] );
			newNote.innerHTML = '<p>' + pageNotes[i][0] + '</p><div class=edit>edit</div><div class=delete>del</div>';
			//newNote.style.cursor = 'pointer';
			//newNote.onclick = function (e) {
			//    console.log("The origin element was " + this.getAttribute('id')); // note that this. does not work correctly ie < 8
			//    //this.style.backgroundColor = 'rgb(109, 143, 187)';
			//	var r = confirm("Are you sure you want to delete?");
			//	if (r==true) {
			//		notes.remove(this.getAttribute('id'));
			//	}
		    //};
			newNote.onmouseover = function (e) {
			    //console.log("The origin element was " + this.getAttribute('id')); // note that this. does not work correctly ie < 8
			    for (var i = 0; i < this.childNodes.length; i++) {
			        if (this.childNodes[i].className == "edit") {
			            this.childNodes[i].style.display = "block";
			            this.childNodes[i].style.cursor = 'pointer';
			        } else if (this.childNodes[i].className == "delete") {
			            this.childNodes[i].style.display = "block";
			            this.childNodes[i].style.cursor = 'pointer';
			            this.childNodes[i].onclick = function (e) {
			                console.log("Element no " + e.target.parentNode.getAttribute('id') + " clicked");
			                notes.remove(e.target.parentNode);
			                //e.target.parentNode.style.backgroundColor = 'rgb(208, 117, 117)';
			            }
			        }
			    }
			};
			newNote.onmouseout = function (e) {
			    //console.log("The origin element was " + this.getAttribute('id')); // note that this. does not work correctly ie < 8
			    for (var i = 0; i < this.childNodes.length; i++) {
			        if ( (this.childNodes[i].className == "edit") || (this.childNodes[i].className == "delete") ) {
			            this.childNodes[i].style.display = "none";
			        }
			    }
			};
			document.getElementById('notes').appendChild(newNote);
		}
	},
	// function to check for updates, check to see if there are any notes with a higher ID number than we ciurreently have
	// if there are, they will be sent back and you can just display them
	update: function () {
	    var xmlhttp = notes.getXmlhttp();
			xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
				{
				//console.log("Raw Data Recieved Was: " +xmlhttp.responseText);
				pageNotes = JSON.parse(xmlhttp.responseText);
				display(pageNotes);
				}
			}
			
		xmlhttp.open("POST","noteQuery.php",true);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send("notesRequest_Type=checkupdate&notesRequest_CheckNotes=" + Page);
	},
	add: function () {
	    note = document.getElementById("noteContent").value;
	    var xmlhttp = notes.getXmlhttp();
		xmlhttp.open("POST","noteQuery.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded"); // provides information in header that it is a form
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
	                notes.note = notes.note.concat(pageNotes); // fingers crossed here TODO: uncross fingers, this may have performance issues down the track though
	                notes.display(pageNotes); // this is really shitty but seemingly unavoidable as it is an event that is executed externally
	                notes.currentPage++; // increment current page
	            }
	            notes.changePageStatus(0);
	        }
	    };
		// xmlhttp.timeout = 1000; // ie11 throws errors if I include this TODO: find out why
		// xmlhttp.ontimeout = function () { notes.changePageStatus(0); }
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
		document.getElementById('status').innerHTML = '<p>' + statusString + '</p>';
	}
}

function checkScroll () { // only his noodliness knows the compatibility of this thing, mobile browsers seem not to like this, need alternatives...
	// some shitty compatibility stuff here
	var body = document.body,
    html = document.documentElement;
	var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
	// end shitty compatibility
	
	console.log( "window.pageYOffset: " + window.pageYOffset + " documentHeight " + documentHeight + " window.innerHeight: " + window.innerHeight ); // debugness
	if ( window.pageYOffset + window.innerHeight > (documentHeight - pixelBufferFetch)  & notes.status == 0) { // was if ( window.pageYOffset + window.innerHeight > (documentHeight - 50)  & notes.status == 0) { 
		notes.getPage();
	}
}

// this function will use get page until the current page is full
function fillPage () {
    // some shitty compatibility stuff here
    var body = document.body; 
    var html = document.documentElement;
    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    // end shitty compatibility
	
    if ((window.innerHeight + pixelBufferFetch) > documentHeight) { // was if ((window.innerHeight + 50) > documentHeight) {
        if (notes.status == 0) { // simple blocking system, prevents notes from loading in wrong order TODO: FIX ,this may have issues when scrolling too fast, may need some kind of queuing system
            console.log("A page was requested during filling");
            notes.getPage();
        }
    }
}


function init () {
   // window.setInterval(fillPage, 1000); // todo: auto destruct this event after page filled
    fillPage();
    
	window.onscroll = checkScroll; // only check after the page has loaded
	// a touchmove event on mobile devices may be a good alternative
}
window.onload = init;