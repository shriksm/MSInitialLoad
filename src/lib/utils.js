import utf8 from 'utf8'

export const handleErrors = (response) => {
    // console.log('handleErrors response: ' + JSON.stringify(response));
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const getCalculatedWidth = (screenWidth, givenWidth) => {
    const visualDesignWidth = 375;
    return (screenWidth * givenWidth) / visualDesignWidth;
}

export const getCalculatedHeight = (screenHeight, givenHeight) => {
    const visualDesignHeight = 667;
    return (screenHeight * givenHeight) / visualDesignHeight;
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
    console.log(`utils.signIn email: ${email}; password: ${password}`)
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
    .catch (err =>{console.log(err); throw err})
}

export const getTabascoTokens = (tokens) => {
    var uri = "https://home.myharmony.com/oauth2/token?"
    
    console.log('uri: ' + JSON.stringify(tokens));

    var bodyText = 'access_token=' + encodeURIComponent(tokens.access_token) +
                    '&id_token=' + encodeURIComponent(tokens.id_token) +
                    '&grant_type=' + encodeURIComponent('password') +
                    '&scope=' + encodeURIComponent('local,remote') +
                    '&logitech_domain=' + encodeURIComponent('svcs.myharmony.com') +
                    '&client_id=' + encodeURIComponent('b5d626f9');

    return fetch(uri,
                {
                    method: 'POST',
                    headers: {
                        'User-Agent': 'Harmony_Android_5.3_2',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Host':	'home.myharmony.com'
                    },
                    body: bodyText
                })
            .then(handleErrors)
            .then(response => {
                    // console.log("1 = " + response);
                    return response.text();
                })
            .then(response => {
                try {
                    // console.log("2 = " + response);
                    let jsonResponse = JSON.parse(response);
                    // console.log("3 = " +  + jsonResponse);
                    return jsonResponse;
        
                } catch (exception) {
                    throw exception;
                }
            })
            .catch (err =>{console.log(err); throw err})
}

export const getCookies = (tokens) => {
    console.log(`tokens: ${JSON.stringify(tokens)}`);
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

export const getMyHousehold = (tokens) => {
    console.log(`tokens: ${JSON.stringify(tokens)}`);
    if (!(tokens || tokens.id_token || tokens.access_token)) {
        throw Error('One or more tokens are null: tokens: ' + tokens);
    }
    let accessToken = tokens.access_token;

    return fetch('https://svcs.myharmony.com/HarmonyPlatform/AccountManager.svc/json2/GetMyHousehold', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(handleErrors)
    .then(response => {
        console.log(`getMyHousehold 1: ${response}`);
        return response.text();
    })
    .then(response => {
        try {
            //console.log(response);
            let jsonResponse = JSON.parse(response);
            console.log(`getMyHousehold 1: ${JSON.stringify(jsonResponse)}`);
            return {
                accountId: jsonResponse.GetMyHouseholdResult.Accounts[0]["Id-"],
                remoteId: jsonResponse.GetMyHouseholdResult.Accounts[0].Remotes[0]["Id-"]
            };
        } catch (exception) {
            throw exception;
        }
    })
    .catch (error =>{throw error})
}

export const getProvisionInfo = (hubIp) => {
    //console.log('Inside getProvisionInfo tokensWithCookie: ' + tokensWithCookie);
    return fetch(`http://${hubIp}:8088/`, {
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

export const getDiscoveryInfo = (hubIp) => {
    console.log('Inside getDiscoveryInfo getDiscoveryInfo: hubIp: ' + hubIp);
    return fetch(`http://${hubIp}:8088/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://sl.dhg.myharmony.com'
        },
        body: JSON.stringify({
            "id": 2,
            "cmd": "connect.discoveryinfo?get",
            "timeout": 90000
        })
    })
    .then(handleErrors)
    .then(response => {
            console.log(`getDiscoveryInfo 1: ${response}`);
            return response.text();
        })
    .then(response => {
            try {
                let discInfo = JSON.parse(response);
                console.log(`getDiscoveryInfo 2: ${JSON.stringify(discInfo)}`);
                return {accountId: discInfo.data.accountId, remoteId: discInfo.data.remoteId};
            } catch (exception) {
                throw exception;
            }
        })
    .catch (error =>{throw error})
}