"use strict";

//Validates task form and loads tasks from server
var handleTask = function handleTask(e) {
  e.preventDefault();
  $("#taskMessage").animate({
    width: 'hide'
  }, 350); //Validates all fields were entered

  if ($("#taskName").val() == '' || $("taskDate").val() == '' || $("#taskDescription").val() == '') {
    handleError("Error: All fields are required!");
    return false;
  } //Adds the task to the list and loads them all in


  sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
    document.querySelector("#status").innerHTML = "<h3>Task added!</h3>";
    loadTasksFromServer($("#csrf").val());
  });
  return false;
}; //Validates and updates the current username


var handleChangeUsername = function handleChangeUsername(e) {
  e.preventDefault();
  $("#taskMessage").animate({
    width: 'hide'
  }, 350); //Checks to see that a username was entered

  if ($("#newUsername").val() == '') {
    handleError("Error: Username is required!");
    return false;
  } //Sends request to /changeUsername
  //Reloads the task form and welcome message


  sendAjax('POST', $("#changeUsernameForm").attr("action"), $("#changeUsernameForm").serialize(), function () {
    document.querySelector("#status").innerHTML = "<h3>Username updated!</h3>";
    createTaskForm($("#csrf"));
    createWelcomeMessage();
  });
}; //Validates password changes and sends POST request to the server


var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#taskMessage").animate({
    width: 'hide'
  }, 350); //Checks to see that all fields were entered

  if ($("#username").val() == '' || $("#currPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("Error: All fields are required!");
    return false;
  } //Sends request to /changePass and reloads the task form


  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), function () {
    document.querySelector("#status").innerHTML = "<h3>Password updated!</h3>";
    createTaskForm($("#csrf"));
  });
  return false;
}; //Sends DELETE request to the server for a specific task name and description


var deleteTask = function deleteTask(e, name, desc, csrf) {
  e.preventDefault();
  sendAjax('DELETE', '/deleteTask', "name=".concat(name, "&description=").concat(desc, "&_csrf=").concat(csrf), function () {
    loadTasksFromServer(csrf);
    document.querySelector("#status").innerHTML = '<h3>Task deleted!</h3>';
  });
};
/*  Task form
    
    Date:
    Task:
    Description:
*/


var TaskForm = function TaskForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "taskForm",
    onSubmit: handleTask,
    name: "taskForm",
    action: "/maker",
    method: "POST",
    className: "taskForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date"
  }, "Date: "), /*#__PURE__*/React.createElement("input", {
    id: "taskDate",
    type: "date",
    name: "date"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Task: "), /*#__PURE__*/React.createElement("input", {
    id: "taskName",
    type: "text",
    name: "name",
    placeholder: "Task Title"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "description"
  }, "Description: "), /*#__PURE__*/React.createElement("input", {
    id: "taskDescription",
    type: "text",
    name: "description",
    placeholder: "Task Description"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeTaskSubmit",
    type: "submit",
    value: "Make Task"
  }));
}; //Displays tasks and includes a button to delete the specific task


var TaskList = function TaskList(props) {
  if (props.tasks.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "taskList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyTask"
    }, "No Tasks Yet"));
  }

  var taskNodes = props.tasks.map(function (task) {
    return /*#__PURE__*/React.createElement("div", {
      key: task._id,
      className: "task"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "taskDate"
    }, "Date: ", task.date), /*#__PURE__*/React.createElement("h3", {
      className: "taskName"
    }, "Task: ", task.name), /*#__PURE__*/React.createElement("h3", {
      className: "taskDescription"
    }, "Description: ", task.description), /*#__PURE__*/React.createElement("button", {
      type: "button",
      id: "close",
      onClick: function onClick(e) {
        deleteTask(e, task.name, task.description, props.csrf);
      }
    }, "x"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "taskList"
  }, taskNodes);
}; //Loads a welcome message based on the active user


var WelcomeMessage = function WelcomeMessage(props) {
  if (!props.username) {
    return /*#__PURE__*/React.createElement("h3", null, "Please Login to Continue");
  }

  return /*#__PURE__*/React.createElement("h3", null, "Welcome ", /*#__PURE__*/React.createElement("i", null, props.username), "!");
}; //Form for entering a new username


var ChangeUsernameForm = function ChangeUsernameForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changeUsernameForm",
    onSubmit: handleChangeUsername,
    name: "changeUsernameForm",
    action: "/changeUsername",
    method: "POST",
    className: "taskForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newUsername"
  }, "New Username: "), /*#__PURE__*/React.createElement("input", {
    id: "newUsername",
    type: "text",
    name: "newUsername",
    placeholder: "New Username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "changePassSubmit",
    type: "submit",
    value: "Update"
  }));
};
/*  Change Pass Form

    Current Password:
    New Password:
    Retype Password:
*/


var ChangePassForm = function ChangePassForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    onSubmit: handleChangePass,
    name: "changePassForm",
    action: "/changePass",
    method: "POST",
    className: "taskForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "currPassword"
  }, "Current Password: "), /*#__PURE__*/React.createElement("input", {
    id: "currPass",
    type: "password",
    name: "currPass",
    placeholder: "Current Pass"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPassword"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPassword2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "username",
    value: props.username
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrf",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "changePassSubmit",
    type: "submit",
    value: "Update"
  }));
}; //Sends request to /getUser and renders the React component for WelcomeMessage


var createWelcomeMessage = function createWelcomeMessage() {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(WelcomeMessage, {
      username: data.username
    }), document.querySelector("#welcomeMessage"));
  });
}; //Renders the React component for ChangeUsernameForm


var createChangeUsernameForm = function createChangeUsernameForm(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeUsernameForm, {
    csrf: csrf
  }), document.querySelector("#makeTask"));
}; //Sends request to /getUsers and renders the React component for ChangePassForm


var createChangePassForm = function createChangePassForm(csrf) {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassForm, {
      csrf: csrf,
      username: data.username
    }), document.querySelector("#makeTask"));
  });
}; //Gets a list of tasks from the server and loads the React component for TaskList


var loadTasksFromServer = function loadTasksFromServer(csrf) {
  sendAjax('GET', '/getTasks', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
      tasks: data.tasks,
      csrf: csrf
    }), document.querySelector("#tasks"));
  });
}; //Renders the React component for TaskForm


var createTaskForm = function createTaskForm(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskForm, {
    csrf: csrf
  }), document.querySelector("#makeTask"));
}; //Initial setup


var setup = function setup(csrf) {
  //Initializing button controls
  var changePassButton = document.querySelector("#changePassButton");
  var changeUsernameButton = document.querySelector("#changeUsernameButton"); //On click
  //Updates status message and loads ChangePassForm

  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#status").innerHTML = "<h3>Update your password</h3>";
    createChangePassForm(csrf);
  }); //On click
  //Updates status message and loads ChangeUsernameForm

  changeUsernameButton.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#status").innerHTML = "<h3>Enter a New Username</h3>";
    createChangeUsernameForm(csrf);
  }); //Default: Renders TaskForm

  createTaskForm(csrf); //Default: Renders empty TaskList

  ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
    tasks: []
  }), document.querySelector("#tasks")); //Renders WelcomeMessage and loads tasks from server

  createWelcomeMessage();
  loadTasksFromServer(csrf);
}; //Sends request to server to obtain csrfToken
//calls setup() with the csrfToken


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //onload


$(document).ready(function () {
  getToken();
});
"use strict";

//Handles errors by animating the message on screen
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#taskMessage").animate({
    width: 'toggle'
  }, 350);
}; //Redirects to a specified location


var redirect = function redirect(response) {
  $("#taskMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //Sends a request to the server based on type, action, data, and a callback function


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
