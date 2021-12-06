//Validates task form and loads tasks from server
const handleTask = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    //Validates all fields were entered
    if($("#taskName").val() == '' || $("taskDate").val() == '' || $("#taskDescription").val() == '') {
        handleError("Error: All fields are required!");
        return false;
    }

    //Adds the task to the list and loads them all in
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), () => {
        document.querySelector("#status").innerHTML = "<h3>Task added!</h3>";
        loadTasksFromServer($("#csrf").val());
    });

    return false;
};

//Validates and updates the current username
const handleChangeUsername = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    //Checks to see that a username was entered
    if($("#newUsername").val() == '') {
        handleError("Error: Username is required!");
        return false;
    }

    //Sends request to /changeUsername
    //Reloads the task form and welcome message
    sendAjax('POST', $("#changeUsernameForm").attr("action"), $("#changeUsernameForm").serialize(), () => {
        document.querySelector("#status").innerHTML = "<h3>Username updated!</h3>";
        createTaskForm($("#csrf").val());
        createWelcomeMessage();
    })
};

//Validates password changes and sends POST request to the server
const handleChangePass = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    //Checks to see that all fields were entered
    if($("#username").val() == '' || $("#currPass").val() == '' 
        || $("#newPass").val() == '' || $("#newPass2").val() == '') {
            handleError("Error: All fields are required!");
            return false;
    }

    //Sends request to /changePass and reloads the task form
    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), () => {
        document.querySelector("#status").innerHTML = "<h3>Password updated!</h3>";
        createTaskForm($("#csrf").val());
    });

    return false;
};

//Sends DELETE request to the server for a specific task name and description
const deleteTask = (e, name, desc, csrf) => {
    e.preventDefault();

    sendAjax('DELETE', '/deleteTask', `name=${name}&description=${desc}&_csrf=${csrf}`, () => {
        loadTasksFromServer(csrf);
        document.querySelector("#status").innerHTML = '<h3>Task deleted!</h3>';
    });
};

/*  Task form
    
    Date:
    Task:
    Description:
*/
const TaskForm = (props) => {
    return(
        <form id="taskForm"
            onSubmit={handleTask}
            name="taskForm"
            action="/maker"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="date">Date: </label>
            <input id="taskDate" type="date" name="date" />
            <label htmlFor="name">Task: </label>
            <input id="taskName" type="text" name="name" placeholder="Task Title" />
            <label htmlFor="description">Description: </label>
            <input id="taskDescription" type="text" name="description" placeholder="Task Description" />
            <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeTaskSubmit" type="submit" value="Make Task" />
        </form>
    );
};

//Displays tasks and includes a button to delete the specific task
const TaskList = (props) => {
    if(props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No Tasks Yet</h3>
            </div>
        );
    }

    const taskNodes = props.tasks.map((task) => {
        return (
            <div key={task._id} className="task">
                <h3 className="taskDate">Date: {task.date}</h3>
                <h3 className="taskName">Task: {task.name}</h3>
                <h3 className="taskDescription">Description: {task.description}</h3>
                <button type="button" id="close" onClick={(e) => { deleteTask(e, task.name, task.description, props.csrf) }}>
                    x
                </button>
            </div>
        );
    });

    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
};

//Loads a welcome message based on the active user
const WelcomeMessage = (props) => {
    if(!props.username) {
        return (
            <h3>Please Login to Continue</h3>
        );
    }

    return (
        <h3>Welcome <i>{props.username}</i>!</h3>
    );
};

//Form for entering a new username
const ChangeUsernameForm = (props) => {
    return(
        <form id="changeUsernameForm"
            onSubmit={handleChangeUsername}
            name="changeUsernameForm"
            action="/changeUsername"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="newUsername">New Username: </label>
            <input id="newUsername" type="text" name="newUsername" placeholder="New Username" />
            <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="changePassSubmit" type="submit" value="Update" />
        </form>
    );
};

/*  Change Pass Form

    Current Password:
    New Password:
    Retype Password:
*/
const ChangePassForm = (props) => {
    return(
        <form id="changePassForm"
            onSubmit={handleChangePass}
            name="changePassForm"
            action="/changePass"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="currPassword">Current Password: </label>
            <input id="currPass" type="password" name="currPass" placeholder="Current Pass" />
            <label htmlFor="newPassword">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="New Password" />
            <label htmlFor="newPassword2">Retype Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="New Password" />
            <input type="hidden" name="username" value={props.username} />
            <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="changePassSubmit" type="submit" value="Update" />
        </form>
    );
};

//Sends request to /getUser and renders the React component for WelcomeMessage
const createWelcomeMessage = () => {
    sendAjax('GET', '/getUser', null, (data) => {
        ReactDOM.render(
            <WelcomeMessage username={data.username} />,
            document.querySelector("#welcomeMessage")
        );
    });
};

//Renders the React component for ChangeUsernameForm
const createChangeUsernameForm = (csrf) => {
    ReactDOM.render(
        <ChangeUsernameForm csrf={csrf} />,
        document.querySelector("#makeTask")    
    );
};

//Sends request to /getUsers and renders the React component for ChangePassForm
const createChangePassForm = (csrf) => {
    sendAjax('GET', '/getUser', null, (data) => {
        ReactDOM.render(
            <ChangePassForm csrf={csrf} username={data.username} />,
            document.querySelector("#makeTask")
        );
    });
};

//Gets a list of tasks from the server and loads the React component for TaskList
const loadTasksFromServer = (csrf) => {
    sendAjax('GET', '/getTasks', null, (data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks} csrf={csrf} />,
            document.querySelector("#tasks")
        );
    });
};

//Renders the React component for TaskForm
const createTaskForm = (csrf) => {
    ReactDOM.render(
        <TaskForm csrf={csrf} />,
        document.querySelector("#makeTask")
    );
};

//Initial setup
const setup = (csrf) => {

    //Initializing button controls
    const changePassButton = document.querySelector("#changePassButton");
    const changeUsernameButton = document.querySelector("#changeUsernameButton");

    //On click
    //Updates status message and loads ChangePassForm
    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#status").innerHTML = "<h3>Update your password</h3>";
        createChangePassForm(csrf);
    });

    //On click
    //Updates status message and loads ChangeUsernameForm
    changeUsernameButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#status").innerHTML = "<h3>Enter a New Username</h3>";
        createChangeUsernameForm(csrf);
    });

    //Default: Renders TaskForm
    createTaskForm(csrf);

    //Default: Renders empty TaskList
    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.querySelector("#tasks")
    );

    //Renders WelcomeMessage and loads tasks from server
    createWelcomeMessage();
    loadTasksFromServer(csrf);
};

//Sends request to server to obtain csrfToken
//calls setup() with the csrfToken
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//onload
$(document).ready(() => {
    getToken();
});