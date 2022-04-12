/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    console.log(`${message}`);
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('taskMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('taskMessage').classList.add('hidden');
    if (result.error) {
        handleError(result.error);
    }

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (handler) {
        handler(result);
    }


};

const hideError = () => {
    document.getElementById('taskMessage').classList.add('hidden');
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////main.js unedited//////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.className === 'clonedDiv' || ev.target.className === "card")
        return;
    var data = ev.dataTransfer.getData("text");
    //console.log(document.getElementById(data));
    ev.target.appendChild(document.getElementById(data));
}

module.exports = {
    handleError,
    sendPost,
    hideError,
    drag,
    allowDrop,
    drop,
};