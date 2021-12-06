const handleTask = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    if($("#taskName").val() == '' || $("taskDate").val() == '' || $("#taskDescription").val() == '') {
        handleError("Error: All fields are required!");
        return false;
    }

    console.log($("#taskForm").serialize());
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), () => {
        document.querySelector("#status").innerHTML = "<h3>Task added!</h3>";
        loadTasksFromServer($("#csrf").val());
    });

    return false;
};

const handleChangeUsername = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    if($("#newUsername").val() == '') {
        handleError("Error: Username is required!");
        return false;
    }

    sendAjax('POST', $("#changeUsernameForm").attr("action"), $("#changeUsernameForm").serialize(), () => {
        document.querySelector("#status").innerHTML = "<h3>Username updated!</h3>";
        createTaskForm($("#csrf"));
        createWelcomeMessage();
    })
};

const handleChangePass = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    if($("#username").val() == '' || $("#currPass").val() == '' 
        || $("#newPass").val() == '' || $("#newPass2").val() == '') {
            handleError("Error: All fields are required!");
            return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), () => {
        document.querySelector("#status").innerHTML = "<h3>Password updated!</h3>";
        createTaskForm($("#csrf"));
    });

    return false;
};

const deleteTask = (e, name, desc, csrf) => {
    e.preventDefault();

    console.log(csrf);
    sendAjax('DELETE', '/deleteTask', `name=${name}&description=${desc}&_csrf=${csrf}`, () => {
        loadTasksFromServer(csrf);
        document.querySelector("#status").innerHTML = '<h3>Task deleted!</h3>';
    });
};

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

const TaskList = (props) => {
    if(props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No Tasks Yet</h3>
            </div>
        );
    }

    console.log(props);

    const taskNodes = props.tasks.map((task) => {
        return (
            <div key={task._id} className="task" onClick={(e) => { deleteTask(e, task.name, task.description, props.csrf) }}>
                <h3 className="taskDate">Date: {task.date}</h3>
                <h3 className="taskName">Task: {task.name}</h3>
                <h3 className="taskDescription">Description: {task.description}</h3>
            </div>
        );
    });

    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
};

const WelcomeMessage = (props) => {
    if(!props.username) {
        return (
            <h3>Please Login to Continue</h3>
        );
    }

    return (
        <h3>Welcome {props.username}!</h3>
    );
};

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

const ChangePassForm = (props) => {
    console.log(props);
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

const createWelcomeMessage = () => {
    sendAjax('GET', '/getUser', null, (data) => {
        ReactDOM.render(
            <WelcomeMessage username={data.username} />,
            document.querySelector("#welcomeMessage")
        );
    });
};

const createChangeUsernameForm = (csrf) => {
    ReactDOM.render(
        <ChangeUsernameForm csrf={csrf} />,
        document.querySelector("#makeTask")    
    );
};

const createChangePassForm = (csrf) => {
    sendAjax('GET', '/getUser', null, (data) => {
        ReactDOM.render(
            <ChangePassForm csrf={csrf} username={data.username} />,
            document.querySelector("#makeTask")
        );
    });
};

const loadTasksFromServer = (csrf) => {
    sendAjax('GET', '/getTasks', null, (data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks} csrf={csrf} />,
            document.querySelector("#tasks")
        );
    });
};

const createTaskForm = (csrf) => {
    ReactDOM.render(
        <TaskForm csrf={csrf} />,
        document.querySelector("#makeTask")
    );
};

const setup = (csrf) => {
    const changePassButton = document.querySelector("#changePassButton");
    const changeUsernameButton = document.querySelector("#changeUsernameButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#status").innerHTML = "<h3>Update your password</h3>";
        createChangePassForm(csrf);
    });

    changeUsernameButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("#status").innerHTML = "<h3>Enter a New Username</h3>";
        createChangeUsernameForm(csrf);
    });

    createTaskForm(csrf);

    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.querySelector("#tasks")
    );

    createWelcomeMessage();
    loadTasksFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(() => {
    getToken();
});