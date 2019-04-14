  //*** FCM */
  /*export function showToken(currentToken) {
    // Show token in console and UI.
    var tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
}*/

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
export function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        // TODO(developer): Send the current token to your server.
        setTokenSentToServer(true);
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }
}

export function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}

export function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

/*showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
        div.style = 'display: visible';
    } else {
        div.style = 'display: none';
    }
}*/

/*requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    this.messaging.requestPermission().then(function() {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // [START_EXCLUDE]
        // In many cases once an app has been granted notification permission, it
        // should update its UI reflecting this.
        //resetUI();
        // [END_EXCLUDE]
    }).catch(function(err) {
        console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
}*/

/*deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    this.messaging.getToken().then(function(currentToken) {
        this.messaging.deleteToken(currentToken).then(function() {
        console.log('Token deleted.');
        this.setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        //this.resetUI();
        // [END_EXCLUDE]
        }).catch(function(err) {
        console.log('Unable to delete token. ', err);
        });
        // [END delete_token]
    }).catch(function(err) {
        console.log('Error retrieving Instance ID token. ', err);
        this.showToken('Error retrieving Instance ID token. ', err);
    });
}*/