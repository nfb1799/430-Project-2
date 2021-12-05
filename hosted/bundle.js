"use strict";

var handleTask = function handleTask(e) {
  e.preventDefault();
  $("#taskMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#taskName").val() == '' || $("taskDate").val() == '' || $("#taskDescription").val() == '') {
    handleError("Error: All fields are required!");
    return false;
  }

  console.log($("#taskForm").serialize());
  sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
    loadTasksFromServer($("#csrf").val());
  });
  return false;
};

var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#taskMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#username").val() == '' || $("#currPass").val() == '' || $("#newPass") == '' || $("#newPass2") == '') {
    handleError("Error: All fields are required!");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  return false;
};

var deleteTask = function deleteTask(e, name, desc, csrf) {
  e.preventDefault();
  console.log(csrf);
  sendAjax('DELETE', '/deleteTask', "name=".concat(name, "&description=").concat(desc, "&_csrf=").concat(csrf), function () {
    loadTasksFromServer(csrf);
  });
};

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
};

var TaskList = function TaskList(props) {
  if (props.tasks.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "taskList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyTask"
    }, "No Tasks Yet"));
  }

  console.log(props);
  var taskNodes = props.tasks.map(function (task) {
    return /*#__PURE__*/React.createElement("div", {
      key: task._id,
      className: "task",
      onClick: function onClick(e) {
        deleteTask(e, task.name, task.description, props.csrf);
      }
    }, /*#__PURE__*/React.createElement("h3", {
      className: "taskDate"
    }, "Date: ", task.date), /*#__PURE__*/React.createElement("h3", {
      className: "taskName"
    }, "Task: ", task.name), /*#__PURE__*/React.createElement("h3", {
      className: "taskDescription"
    }, "Description: ", task.description));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "taskList"
  }, taskNodes);
};

var WelcomeMessage = function WelcomeMessage(props) {
  if (!props.username) {
    return /*#__PURE__*/React.createElement("h3", null, "Please Login to Continue");
  }

  return /*#__PURE__*/React.createElement("h3", null, "Welcome ", props.username, "!");
};

var ChangePassForm = function ChangePassForm(props) {
  console.log(props);
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
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "changePassSubmit",
    type: "submit",
    value: "Update"
  }));
};

var createWelcomeMessage = function createWelcomeMessage() {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(WelcomeMessage, {
      username: data.username
    }), document.querySelector("#welcomeMessage"));
  });
};

var createChangePassForm = function createChangePassForm(csrf) {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassForm, {
      csrf: csrf,
      username: data.username
    }), document.querySelector("#makeTask"));
  });
};

var loadTasksFromServer = function loadTasksFromServer(csrf) {
  sendAjax('GET', '/getTasks', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
      tasks: data.tasks,
      csrf: csrf
    }), document.querySelector("#tasks"));
  });
};

var setup = function setup(csrf) {
  var changePassButton = document.querySelector("#changePassButton");
  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePassForm(csrf);
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskForm, {
    csrf: csrf
  }), document.querySelector("#makeTask"));
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
    tasks: []
  }), document.querySelector("#tasks"));
  createWelcomeMessage();
  loadTasksFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#taskMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#taskMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

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
