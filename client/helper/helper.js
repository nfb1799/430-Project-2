//Handles errors by animating the message on screen
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#taskMessage").animate({width:'toggle'},350);
};

//Redirects to a specified location
const redirect = (response) => {
    $("#taskMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

//Sends a request to the server based on type, action, data, and a callback function
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};