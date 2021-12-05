const handleTask = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    if($("#taskName").val() == '' || $("taskDate").val() == '' || $("#taskDescription").val() == '') {
        handleError("Error: All fields are required!");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), () => {
        loadTasksFromServer();
    });

    return false;
};

const handleChangePass = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    if($("#username").val() == '' || $("#currPass").val() == '' || $("#newPass") == '' || $("#newPass2") == '') {
        handleError("Error: All fields are required!");
        return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

    return false;
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
            <input type="hidden" name="_csrf" value={props.csrf} />
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

    const taskNodes = props.tasks.map((task) => {
        return (
            <div key={task._id} className="task">
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

const ChangePassForm = (props) => {
    return(
        <form id="changePassForm"
            onSubmit={handleChangePass}
            name="changePassForm"
            action="/changePass"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="username" type="text" name="username" placeholder="Username" />
            <label htmlFor="currPassword">Current Password: </label>
            <input id="currPass" type="password" name="currPass" placeholder="Current Pass" />
            <label htmlFor="newPassword">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="New Password" />
            <label htmlFor="newPassword2">Retype Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="New Password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
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

const createChangePassForm = (csrf) => {
    ReactDOM.render(
        <ChangePassForm csrf={csrf} />,
        document.querySelector("#makeTask")
    );
};

const loadTasksFromServer = () => {
    sendAjax('GET', '/getTasks', null, (data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks} />,
            document.querySelector("#tasks")
        );
    });
};

const setup = (csrf) => {
    const changePassButton = document.querySelector("#changePassButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePassForm(csrf);
        return false;
    })

    ReactDOM.render(
        <TaskForm csrf={csrf} />,
        document.querySelector("#makeTask")
    );

    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.querySelector("#tasks")
    );

    createWelcomeMessage();
    loadTasksFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(() => {
    getToken();
});