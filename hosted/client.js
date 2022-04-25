
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////Helpers///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();


  if (ev.target.id === 'toDo' || ev.target.id === "inProgress" || ev.target.id === "done") {
    var data = ev.dataTransfer.getData("text");
    //console.log(document.getElementById(data));
    ev.target.appendChild(document.getElementById(data));
    //this is where we handle changing where it was left off

    if (ev.target.id === 'toDo') {

    }
    else if (ev.target.id === "inProgress") {

    }
    else if (ev.target.id === "done") {

    }
  }

}
