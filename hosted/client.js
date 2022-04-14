//const helper = require('./helper.js');

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  /*
  if (ev.target.id === 'burnerDiv' || ev.target.id === "burnerDivCopy" || ev.target.id === "task"|| ev.target.className === "card"|| ev.target.className === "topOfCard"|| ev.target.className === "middleOfCard"|| ev.target.className === "bottomOfCard")
    return;
    */
  if (ev.target.id === 'toDo' || ev.target.id === "inProgress" || ev.target.id === "done") {
    var data = ev.dataTransfer.getData("text");
    //console.log(document.getElementById(data));
    ev.target.appendChild(document.getElementById(data));
    //this is where we handle changing where it was left off

    if (ev.target.id === 'toDo') {
      //helper.sendPost('/updateTask',)
    }
    else if (ev.target.id === "inProgress") {

    }
    else if (ev.target.id === "done") {

    }
  }

}