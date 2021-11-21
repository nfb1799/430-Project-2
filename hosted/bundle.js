"use strict";

var handleTask = function handleTask(e) {
  e.preventDefault();
  $("#taskMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#taskName").val() === '' || $("taskDate").val() === '' || $("#taskDescription").val() === '') {
    handleError("Error: All fields are required!");
    return false;
  }

  sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
    loadTasksFromServer();
  });
  return false;
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
    }, "Description: ", task.description));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "taskList"
  }, taskNodes);
};

var loadTasksFromServer = function loadTasksFromServer() {
  sendAjax('GET', '/getTasks', null, function (data) {
    console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
      tasks: data.tasks
    }), document.querySelector("#tasks"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskForm, {
    csrf: csrf
  }), document.querySelector("#makeTask"));
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
    tasks: []
  }), document.querySelector("#tasks"));
  loadTasksFromServer();
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
