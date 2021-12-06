//Validates login and redirects to /maker
const handleLogin = (e) => {
    e.preventDefault();

    $("#loginMessage").animate({width:'hide'},350);

    //Checks to see that both fields were entered
    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Error: Username or password is empty!");
        return false;
    }

    //Sends request to attempt to login
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

//Validates signup and redirects to /maker
const handleSignup = (e) => {
    e.preventDefault();

    $("#loginMessage").animate({width:'hide'},350);

    //Checks to see that all fields were entered 
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Error: All fields are required!");
        return false;
    }

    //Sends request to the server and attempts to signup
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

//Form for logging in
const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

//Form for signing up
const SignupWindow = (props) => {
    return (
        <form id="signupForm" 
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign up"  />
        </form>
    );
};

//Renders the login form
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//Renders the signup form
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//Initial setup
const setup = (csrf) => {
    
    //Initializing button controls
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    //On click
    //Loads the signup form
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    //On click
    //Loads the login form
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    //Default: loads the login form
    createLoginWindow(csrf); 
};

//Sends request to the server to obtain csrfToken
//Calls setup() with the csrfToken
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//onload
$(document).ready(function() {
    getToken();
});