const helper = require('./helper.js');

//on submit for our forms
const handletask = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value;
    const age = e.target.querySelector('#taskAge').value;
    const height = e.target.querySelector('#taskHeight').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!name || !age || !height) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, height, _csrf }, loadTasksFromServer);
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


            <label htmlFor="title">Title: </label>
            <input id="taskTitle" type="text" name="name" placeholder="task title" />

            <label htmlFor="description">Description: </label>
            <input id="taskAge" type="number" min="0" name="age" placeholder="5" />



            <label htmlFor="height">Height: </label>
            <input id="taskHeight" type="number" min="0" name="height" placeholder="56" />

            <input className="makeTaskSubmit" type="submit" value="Make task" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
        </form>
    );
}

const TaskList = (props) => {
    //if empty
    if (props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptytask">No tasks yet!</h3>
            </div>
        );
    }

    //create our list
    const taskNodes = props.tasks.map(task => {
        return (
            <div key={task._id} className="task">
                <img src="/assets/img/taskface.jpeg" alt="task face" className="taskFace" />
                <h3 className="taskTitle">Title:{task.title}</h3>
                <h3 className="taskDescription">Description:{task.description}</h3>
                <h3 className="taskDueDate">Due Date:{task.dueDate}</h3>
            </div>
        );
    });


    //after constructing our list output it to the user
    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
}

//function that handles loading tasks from server
const loadTasksFromServer = async () => {
    //get the response from the router so we have our data.tasks
    const response = await fetch('/getTasks');
    const data = await response.json();

    //render now using the data
    ReactDOM.render(
        <TaskList tasks={data.tasks} />,
        document.getElementById('tasks')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    //render our task form and once again because we are  posting we gotta make it secure
    ReactDOM.render(
        <TaskForm csrf={data.csrfToken} />,
        document.getElementById('makeTask')
    );

    //on init load page without tasks so this works for users logged in and users that are logged out
    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.getElementById('tasks')
    );


    loadTasksFromServer();
}

window.onload = init;