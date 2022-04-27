const sendPost = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////Helpers///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const getCsrfToken = async () => {
  const response = await fetch('/getToken');
  const data = await response.json();

  return data.csrfToken;
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}
async function drop(ev) {
  ev.preventDefault();


  if (ev.target.id === 'toDo' || ev.target.id === "inProgress" || ev.target.id === "done" ) {
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    //this is where we handle changing where it was left off

    if (ev.target.id === 'toDo') {
      const _csrf = await getCsrfToken();
      const title = data;
      const newSpot = ev.target.id;
      await sendPost('/updateTask', { title, newSpot, _csrf });
    }
    else if (ev.target.id === "inProgress") {
      const _csrf = await getCsrfToken();
      const title = data;
      const newSpot = ev.target.id;
      await sendPost('/updateTask', { title, newSpot, _csrf });
    }
    else if (ev.target.id === "done") {
      const _csrf = await getCsrfToken();
      const title = data;
      const newSpot = ev.target.id;
      await sendPost('/updateTask', { title, newSpot, _csrf });
    }

  }
  //Set up the garbage to delete cards that are dragged into it
  else if (ev.target.id === 'garbageBin') {
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    console.log('into the garbage');
    const _csrf = await getCsrfToken();
    const title = data;
    //location.reload();
    await sendPost('/deleteTask', { title, _csrf });

  }

}