
//just an idea on using sessionStorage.
/*******************************************
 * 
 * @param   string      itemName        Item's name for sessionStorage
 * @param   function    resquestCall    Callback to fetch source,should return another function/promise.
 * @param   function    willUpdateCall  Callback to invoke when source is updated. 
 * @param   integer     expiry          Seconds before the item is expire, where it will invoke the resquestCall.In other word, when will the data refresh.
 * @return  Null.
 * @method  function    run             Pass this method as a parameter of setTimeout or setInterval function.
 * 
 *******************************************/

function LiveSession(itemName, resquestCall, willUpdateCall, expiry){

    this.source = null;

    //contructer of this class, where it will invoke the first loop without condition.
    var currTimestamp = Math.floor(Date.now()/1000);
    var successCall = resquestCall();
    successCall(
        function(response){
            var stringResponse = JSON.stringify(response);
            willUpdateCall(response);
            sessionStorage.setItem(itemName, stringResponse);
            sessionStorage.setItem(itemName+'Expiry', currTimestamp+expiry);
            this.source = stringResponse;
        }.bind(this)
    )

    this.run = function(){
        var currTimestamp = Math.floor(Date.now()/1000);
        if(this.source == null || (currTimestamp> sessionStorage.getItem(itemName+'Expiry'))){
            successCall = resquestCall();
            successCall(
                function(response){
                    var stringResponse = JSON.stringify(response);
                    if(stringResponse !== sessionStorage.getItem(itemName)){
                        willUpdateCall(response);
                    }
                    sessionStorage.setItem(itemName, stringResponse);
                    sessionStorage.setItem(itemName+'Expiry', currTimestamp+expiry);
                    this.source = stringResponse;
                }
            )
        }else if(this.source !== sessionStorage.getItem(itemName)){
            this.source = sessionStorage.getItem(itemName);
            willUpdateCall(JSON.parse(this.source));
        }
    }.bind(this);
}

function LiveLocal(itemName, resquestCall, willUpdateCall, expiry){

    this.source = null;

    //contructer of this class, where it will invoke the first loop without condition.
    var currTimestamp = Math.floor(Date.now()/1000);
    var successCall = resquestCall();
    successCall(
        function(response){
            var stringResponse = JSON.stringify(response);
            willUpdateCall(response);
            localStorage.setItem(itemName, stringResponse);
            localStorage.setItem(itemName+'Expiry', currTimestamp+expiry);
            this.source = stringResponse;
        }.bind(this)
    )


    this.run = function(){
        console.log('invoked');
        var currTimestamp = Math.floor(Date.now()/1000);
        if(this.source == null || (currTimestamp > localStorage.getItem(itemName+'Expiry'))){

            var successCall = resquestCall();
            successCall(
                function(response){
                    console.log(successCall);
                    var stringResponse = JSON.stringify(response);
                    if(stringResponse !== localStorage.getItem(itemName)){
                        console.log('will update!');
                        willUpdateCall(response);
                    }
                    localStorage.setItem(itemName, stringResponse);
                    localStorage.setItem(itemName+'Expiry', currTimestamp+expiry);
                    this.source = stringResponse;
                }.bind(this)
            )
        }else if(this.source !== localStorage.getItem(itemName)){
            console.log('no fetch but update')
            this.source = localStorage.getItem(itemName);
            willUpdateCall(JSON.parse(this.source));
        }

    }.bind(this);
}

