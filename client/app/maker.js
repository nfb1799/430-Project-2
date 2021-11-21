const handleTask = (e) => {
    e.preventDefault();

    $("#taskMessage").animate({width:'hide'},350);

    if($("#taskName").val() == '' || $("taskDate").val() == '' || $("#taskDescription").val() == '') {
        handleError("Error: All fields are required!");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), () => {
        loadTasksFromServer();
        console.log($("#taskForm").attr("action"));
    });

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

const loadTasksFromServer = () => {
    sendAjax('GET', '/getTasks', null, (data) => {
        console.log(data);
        ReactDOM.render(
            <TaskList tasks={data.tasks} />,
            document.querySelector("#tasks")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <TaskForm csrf={csrf} />,
        document.querySelector("#makeTask")
    );

    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.querySelector("#tasks")
    );

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