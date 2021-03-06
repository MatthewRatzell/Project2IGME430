const helper = require('./helper.js');

//on submit for our forms
const handletask = (e) => {
    e.preventDefault();
    helper.hideError();
    const title = e.target.querySelector('#taskTitle').value;
    const description = e.target.querySelector('#taskDescription').value;
    const dueDate = e.target.querySelector('#taskDueDate').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    const currentSpot = 'toDo';

    if (!title || !description || !dueDate || !currentSpot) {
        helper.handleError('All Fields Are Required To Make Task!');
        return false;
    }

    helper.sendPost(e.target.action, { title, description, currentSpot, dueDate, _csrf }, loadTasksFromServer);
    return false;
}

//where we add our tasks
const TaskForm = (props) => {
    return (

        <form id="taskForm"
            name="taskForm"
            onSubmit={handletask}
            action="/taskBoard"
            method="POST"
            className="taskForm">


            <div id="inputs">
                <label htmlFor="title" className="is-size-4 has-text-centered"> Title: </label>
                <input className="input is-small" id="taskTitle" type="text" name="title" placeholder="task title" />

                <label htmlFor="description" className="is-size-4 has-text-centered">Description: </label>
                <input className="input is-small" id="taskDescription" type="text" name="title" placeholder="task description" />

                <label htmlFor="cardDueDate" className="is-size-4 has-text-centered">Due Date:</label>
                <input className="input is-small" id="taskDueDate" type="datetime-local" name="cardDueDate"></input>
            </div>
            <div id="submitBtn">
                <input className="button" type="submit" value="Make task" />
            </div>

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </form>
    );
}
//react element for each individual task
const Task = (props) => {
    return (
        <div className="card">

            <button className="collapsible Button is-size-4">{props.task.title}</button>

            <div id="collapsibleContent" >

                <div className="middleOfCard">
                    <h2>{props.task.description}</h2>
                </div>
                <div className="bottomOfCard">
                    <h2>Due:{props.task.dueDate}</h2>
                </div>

            </div>
        </div>
    );
}

const loadTaskList = (tasks) => {
    //grab our 3 different areas to plug into as well as the burner div
    const toDo = document.getElementById('toDo');
    const inProgress = document.getElementById('inProgress');
    const done = document.getElementById('done');
    const burnerDivsHome = document.getElementById('burnerDivHome');

    toDo.innerHTML = `<strong><u>To Do</u></strong>`;
    inProgress.innerHTML = `<strong><u>In Progress</u></strong>`;
    done.innerHTML = `<strong><u>Done</u></strong>`;


    //if empty
    if (tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptytask">No tasks yet!</h3>
            </div>
        );
    }

    //loop through and create all of our react tasks
    for (let i = 0; i < tasks.length; i++) {

        //rename the coppied empty template to burnerDiv
        document.getElementById('burnerDivCopy').id = 'burnerDiv';

        //render each reactDom
        ReactDOM.render(
            <Task task={tasks[i]} />,
            document.getElementById('burnerDiv')
        );

        //make sure it goes into its right homw
        if (tasks[i].currentSpot == 'toDo') {
            toDo.append(document.getElementById('burnerDiv'));
        }
        else if (tasks[i].currentSpot == 'inProgress') {
            inProgress.append(document.getElementById('burnerDiv'));
        }
        else if (tasks[i].currentSpot == 'done') {
            done.append(document.getElementById('burnerDiv'));
        }

        //now that the first burner div has been moved to todo we need to change its id
        document.getElementById('burnerDiv').id = tasks[i].title;

        //first duplicate our burner div and add it to the home of divs 
        burnerDivsHome.append(document.getElementById('burnerDivCopy').cloneNode(true));
    }

    //now that all of the tasks are made  make sure we hook up the collaspability we want
    helper.makeCardsCollaspsible();

}


//function that handles loading tasks from server
const loadTasksFromServer = async () => {
    //get the response from the router so we have our data.tasks
    const response = await fetch('/getTasks');
    const data = await response.json();

    loadTaskList(data.tasks);
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    //render our task form and once again because we are  posting we gotta make it secure
    ReactDOM.render(
        <TaskForm csrf={data.csrfToken} />,
        document.getElementById('makeTask')
    );

    loadTasksFromServer();
}



window.onload = init;
