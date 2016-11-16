
var error='';
if(error.length!==0)
{
	console.log(error);
}


function startAjax()
{
var temp="";

try
	{
		switch(true)
		{
			case (typeof XMLHttpRequest  !== 'undefined'): temp = new XMLHttpRequest(); break;
			case (typeof ActiveXObject  !== 'undefined'): temp = new ActiveXObject("Microsoft.XMLHTTP");; break;
			default: throw 'Ajax not supported';
		
		}
	}
	catch(err)
	{
		window.error= {'ajax':err};
	}

return temp;

}

function getAjax(url,callback,method,postvalue) //method default to GET.
{

var xhttp=new startAjax();

xhttp.onreadystatechange= function()
	{
		if(xhttp.readyState == 4 && xhttp.status == 200)
			{
				callback(xhttp);
			}			
	}

xhttp.open( (typeof method !== 'undefined' ? method :'GET')	,url,true);
xhttp.send( (typeof postvalue !== 'undefined' ? postvalue :'') );

}

function field(url)
{
var href=decodeURI(window.location.href);
var field=href.substr(href.indexOf("?"),href.length);
return url+field;
}


