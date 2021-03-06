//const { format } = require('express/lib/response');

const helper = require('./helper.js');



//built in redirect and error handling done for us
const handleLogin = (e) => {
    //e is the form calling
    e.preventDefault();
    helper.hideError();

    //pull in the 3 things we need from the form
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    const premium = '0';

    if (!username || !pass || !premium) {
        helper.handleError('Username Or Password Is Empty');
        return false;
    }

    //send the post to call our router 
    helper.sendPost(e.target.action, { username, pass, premium, _csrf });
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    const premium = '0';

    if (!username || !pass || !pass2 || !premium) {
        helper.handleError('All Fields Are Required');
        return false;
    }
    if (pass !== pass2) {
        helper.handleError('Passwords Do Not Match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2, premium, _csrf });

    return false;
}
//function stateless componenet does not update on the fly
const LoginWindow = (props) => {
    return (

        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm">

            <div id="inputs">
                <label htmlFor="username" className="is-size-4 has-text-centered">Username: </label>
                <input className="input is-small" id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass" className="is-size-4 has-text-centered" >Password: </label>
                <input className="input is-small" id="pass" type="password" name="pass" placeholder="password" />
                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            </div>
            <div className="break"></div>
            <div id="submitBtn">
                <input className="button" type="submit" value="Sign in" />
            </div>
        </form>
    );
};
//function stateless componenet does not update on the fly
const SignupWindow = (props) => {
    return (

        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <div id="inputs">
                <label htmlFor="username" className="is-size-4 has-text-centered">Username: </label>
                <input className="input is-small" id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass" className="is-size-4 has-text-centered">Password: </label>
                <input className="input is-small" id="pass" type="password" name="pass" placeholder="password" />
                <label htmlFor="pass2" className="is-size-4 has-text-centered">Retype Password: </label>
                <input className="input is-small" id="pass2" type="password" name="pass2" placeholder="retype password" />
                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            </div>
            <div className="break"></div>
            <div id="submitBtn">
                <input className="button" type="submit" value="Sign Up" />
            </div>
        </form>
    );
};

//grabs out token set up event listeners
const init = async () => {
    //get our token
    const response = await fetch('/getToken');
    //put it in json this will be used for the props of our react object and will make things more secure
    const data = await response.json();

    //grab the different buttons we need from the view
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    //auto default to rendering login window
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
        document.getElementById('content'));
}


window.onload = init;



