/**
 * Restructure a JSON object into HTML DOM.
 *
 * @param   object        source    A JSON object.
 * @param   string/Object wrapper   HTML element or CSS selector.
 * @param   depth         depth     [Optional]Default 0;
 *
 * @return  object                  An HTML div element.
 */


function jsonToDOM(source,wrapper,depth){
//Represent the depth of current element,will come in handly when you need to style them.
	depth = typeof depth === 'undefined' ? 0 : ++depth ;
//The parent element,'wrapper' accepts HTML element or CSS selector.
	wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;

	wrapper.setAttribute('data-depth',depth);


	Object.keys(source).forEach(function (key){
//Creates new object per value. 

    	var	newElm = document.createElement('li');

      	if(typeof source[key] === 'array' || typeof source[key] === 'object'){
//Goes deeper if the value is an array or an object.
			newElm.innerText = key;
			newWrapper = document.createElement('ul');
			newElm.appendChild(newWrapper);
	        jsonToDOM(source[key],newWrapper,depth);
    	}  else {
	        newElm.innerText = source[key];
	        newElm.setAttribute('data-leaf',true);
    	}
//Puts key as an attribute,grab it will css/js when needed.  
    newElm.setAttribute('data-index',key);
//Chains the value's element under current div.      
    wrapper.appendChild(newElm);
 	}); 
	return;
}
