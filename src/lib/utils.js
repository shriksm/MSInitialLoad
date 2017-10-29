export const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const fetchDevices = (accountId, accessToken) => {
    let uri = `https://svcs.myharmony.com/UserAccountDirectorPlatform/UserAccountDirector.svc/json2/Account/${accountId}/SimpleRestGetDeviceList`;
    console.log('uri: ' + uri);
    return fetch(uri,
        {
            method: 'GET',
            credentials: 'same-origin', // Will include the cookies in the header. Reqd for iOS
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        })
    .then(handleErrors)
    .then(response => {
            //console.log('response from service end point: ' + JSON.stringify(response));
            return response.text();
         })
    .then(response => {
        try {
            //console.log(response);
            let jsonResponse = JSON.parse(response);
            console.log(jsonResponse);
            //console.log('jsonDevicesData: ' + JSON.stringify(jsonResponse.DevicesWithFeatures));
            return jsonResponse.DevicesWithFeatures;
        } catch (exception) {
            throw exception
        }
    })
    .catch(err =>{throw err})
}

export const signIn = (email, password) => {
    return fetch('https://accounts.logi.com/identity/signin',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: JSON.stringify({
                "channel_id": "0a024d3b-1222-4a6f-8ae2-f1c2e2266997",
                "create": false,
                "email": email,
                "password": password,
                "verify_email": false,
                "client_id": "aa10d1b6-d851-444c-8c80-7f63522cc3sd"
            })
        })
    .then(handleErrors)
    .then(response => {
            //console.log(response);
            return response.text();
        })
    .then(response => {
        try {
            //console.log(response);
            let jsonResponse = JSON.parse(response);
            //console.log('identity/signin: ' + jsonResponse);
            return {
                       id_token: jsonResponse.id_token,
                       access_token: jsonResponse.access_token
                   };

        } catch (exception) {
            throw exception;
        }
    })
    .catch (err =>{throw err})
}

export const getCookies = (tokens) => {
    if (!(tokens || tokens.id_token || tokens.access_token)) {
        throw Error('One or more tokens are null: tokens: ' + tokens);
    }
    let accessToken = tokens.access_token;

    return fetch('https://svcs.myharmony.com/CompositeSecurityServices/Security.svc/json2/signin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            "reqId": "1",
            "id_token": tokens.id_token,
            "access_token": accessToken
        })
    })
    .then(handleErrors)
    .then((response) => {
            try {
                return {};
            } catch (exception) {
                throw exception;
            }
        })
    .catch (error =>{throw error})
}

export const getProvisionInfo = (hubIp) => {
    //console.log('Inside getProvisionInfo tokensWithCookie: ' + tokensWithCookie);
    return fetch('http://' + hubIp + ':8088/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://sl.dhg.myharmony.com'
        },
        body: JSON.stringify({
            "id": 1,
            "cmd": "setup.account?getProvisionInfo",
            "timeout": 90000
        })
    })
    .then(handleErrors)
    .then(response => {
            //console.log(response);
            return response.text();
        })
    .then(response => {
            try {
                let provInfo = JSON.parse(response);
                return provInfo.data.accountId
            } catch (exception) {
                throw exception;
            }
        })
    .catch (error =>{throw error})
}