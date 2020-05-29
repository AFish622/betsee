'use strict';

function clickOnSignUpSubmit() {
    $('.sign-up-form').submit(function(event) {
        event.preventDefault();
        let userName = $('.username-input').val();
        let password = $('.password-input').val();
        let firstName = $('.first-name-input').val();
        let lastName = $('.last-name-input').val();
        sendNewUserRequest(userName, password, firstName, lastName);
    })
}

function sendNewUserRequest(username, password, firstName, lastName) {
    let newUser = {
        userName: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
    console.log(newUser)
    $.getJSON('/betsee', function(data) {
        console.log(data)
    })
}

clickOnSignUpSubmit();