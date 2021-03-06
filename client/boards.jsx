
const helper = require('./helper.js');

//on submit for our forms
const handleboard = (e) => {

    e.preventDefault();
    helper.hideError();


    const title = e.target.querySelector('#boardTitle').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!title) {
        helper.handleError('All Fields Are Required To Make A Board');
        return false;
    }

    helper.sendPost(e.target.action, { title, _csrf }, loadBoardsFromServer);
    return false;
}

//where we add our boardss
const MakeNewBoardForm = (props) => {
    return (

        <form id="addNewBoardForm"
            name="addNewBoardForm2"
            onSubmit={handleboard}
            action="/boards"
            method="POST"
            className="addNewBoardForm3">

            <div id="inputs">
                <label htmlFor="title" className="is-size-4 has-text-centered">Add New Board</label>
                <input className="input is-small" id="boardTitle" type="text" name="title" placeholder="board title" />
                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            </div>

            <div id="submitBtn">
                <input className="button" type="submit" value="Make Board" />
            </div>


        </form>
    );
}

//on submit for our forms
const setCurrentBoard = (e) => {

    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#boardTitle').innerHTML;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!title) {
        helper.handleError();
        return false;
    }

    helper.sendPost(e.target.action, { title, _csrf });
    return false;
}

//react element for each individual board
const Board = (props) => {
    return (
        <form id="setBoardForm"
            name="setBoardForm"
            onSubmit={setCurrentBoard}
            action="/setCurrentBoard"
            method="POST"
            className="setBoardForm">


            <label className="is-size-4 has-text-centered" htmlFor="title" id='boardTitle'> {props.board.title} </label>
            <label htmlFor="boardsID" hidden={true} id="boardsID"> {props.board._id} </label>


            <input className="button" type="submit" value="Select This Board" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />

        </form>

    );
}

const loadBoardList = (boards, csrfToken) => {


    //grab the dom we will see to store these jawns
    const boardsDom = document.getElementById('boards');
    const burnerDivsHome = document.getElementById('burnerDivHome');
    boardsDom.innerHTML = "";

    //if there are no boards or if this is their first time logging in generate a random board
    if (boards.length === 0) {
        console.log("no Boards Yet");
        return (
            <div className="taskList">
                <h3 className="emptytask">No tasks yet!</h3>
            </div>
        );
    }

    //loop through and create all of our react tasks
    for (let i = 0; i < boards.length; i++) {

        //rename the coppied empty template to burnerDiv
        document.getElementById('burnerDivCopy').id = 'burnerDiv';

        //render each reactDom
        ReactDOM.render(
            <Board csrf={csrfToken} board={boards[i]} />,
            document.getElementById('burnerDiv')
        );

        boardsDom.append(document.getElementById('burnerDiv'));

        //now that the first burner div has been moved to todo we need to change its id
        document.getElementById('burnerDiv').id = helper.makeid();

        //first duplicate our burner div and add it to the home of divs 
        burnerDivsHome.append(document.getElementById('burnerDivCopy').cloneNode(true));

    }

}

//function that handles loading boards from server
const loadBoardsFromServer = async () => {
    //get the response from the router so we have our data.boards
    const response = await fetch('/getBoards');
    const data = await response.json();

    const csrfResponse = await fetch('/getToken');
    const csrfData = await csrfResponse.json();

    loadBoardList(data.boards, csrfData.csrfToken);
}
const goPremium = async () => {
    console.log('going premium client side');
    //first grab out btn and disable it as we wont be needing it now
    const premiumBtn = document.querySelector('#premiumBtn');
    premiumBtn.style="display: none;"
    //next update the data on the server sending over only the csrf token
    const _csrf = await helper.getCsrfToken();
    helper.sendPost('/makePremium', {  _csrf });
    //finally render the proper board for the user
    const _csrf2 = await helper.getCsrfToken();
    ReactDOM.render(
        <MakeNewBoardForm csrf={_csrf2} />,
        document.getElementById('boardsForm')
    );

}
const init = async () => {

    //than grab our dom
    const premiumBtn = document.querySelector('#premiumBtn');
    premiumBtn.style="display: none;"
    const premiumResponse = await fetch('/checkPremium');
    const premiumData = await premiumResponse.json();
    //only render the ability to add new forms if the user is premium and 1 equals premium
    if (premiumData.premiumStatus === '1') {
        premiumBtn.style="display: none;"
        const response = await fetch('/getToken');
        const data = await response.json();

        //render our task form and once again because we are  posting we gotta make it secure
        ReactDOM.render(
            <MakeNewBoardForm csrf={data.csrfToken} />,
            document.getElementById('boardsForm')
        );
    }
    //else we set up our onclick event for the premium button
    else {
        premiumBtn.style=" ";
        premiumBtn.onclick = goPremium;
    }
}


loadBoardsFromServer();


window.onload = init;
