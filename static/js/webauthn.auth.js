'use strict';

$('#register').submit(function(event) {
  event.preventDefault();

  let username = this.username.value;
  let name = this.name.value;

  if (!username || !name) {
    alert('Name or username is missing!');
    return;
  }

  getMakeCredentialsChallenge({ username, name })
    .then((response) => {
      const publicKey = preformatMakeCredReq(response);
      return navigator.credentials.create({ publicKey });
    })
    .then((newCred) => {
      const makeCredResponse = publicKeyCredentialToJSON(newCred);
      console.log(makeCredResponse);
    });
});

let getMakeCredentialsChallenge = (formBody) => {
  return fetch('/webauthn/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formBody),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status !== 'ok')
        throw new Error(`error: ${response.message}`);

      return response;
    });
};
