/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    console.log(`${message}`);
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
const getCsrfToken = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    return data.csrfToken;
}
function makeCardsCollaspsible() {
    let cards = document.getElementsByClassName("collapsible");


    for (let i = 0; i < cards.length; i++) {
        //whenever the cards button is click we do this function
        cards[i].addEventListener("click", function () {

            this.classList.toggle("active");
            //grab the content it has to be the very next element in the card 
            let content = this.nextElementSibling;

            //if it has a maxHeight take it away
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } //else have it come down 
            else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////main.js unedited//////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = {
    handleError,
    sendPost,
    makeid,
    makeCardsCollaspsible,
    getCsrfToken
};