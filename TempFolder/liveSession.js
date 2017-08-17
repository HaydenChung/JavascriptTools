//just an idea on using sessionStorage.

function getSession(itemName,resquestCall, willUpdateCall,interval){
    var source = sessionStorage.getItem(itemName);
    var currTimestamp = Math.floor(Date.now()/1000);
    if(source == null || (currTimestamp> sessionStorage.getItem(itemName+'Expiry'))){
        source = resquestCall();
        if(source !== sessionStorage.getItem(itemName)){
            willUpdateCall(source);
        }
        sessionStorage.setItem(itemName, source);
        sessionStorage.setItem(itemName+'Expiry', currTimestamp+interval);
    }

    return source;
}

function resquestCall(){
    var result = null;
    ajaxCall('action_name', null, postData).done(
        function(response){
            result = response;
        }
    )
    return result;
}

function willUpdateCall(response){
    console.log(response);
}

setInterval(getSession.bind(null, 'test_1', resquestCall, willUpdateCall, 60000), 10000);

