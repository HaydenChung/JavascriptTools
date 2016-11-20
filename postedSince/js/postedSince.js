
/**
 * 
 * Turn datatime format to a "posted since" memo.(eg. "1week ago").
 *
 * Example:
 * 
 * var posted = new postedSince;
 * posted.notBiggerThan(unit).language(lang).set('element');
 *
 *
 * @method notBiggerThan	              [Optional]Determine the biggest time unit,any time period reach that unit return in a normal date string.Default off.
 * @method language                       [Optional]Determine the language.Default as english.
 ^ @method set                            Begin the process,the function won't do anything with out this method.
 * 
 * @param  string               unit      Any time period longer than 'unit' will return as normal date format. Accepted : second,minute,hour,day,week,month,year and ago.
 * @param  string               lang      Langauge of the returning string. Accepted : chinese,english.
 * @param  string/htmlElement   element   CSS selector or html element that the function should transform,the source need to be in US date format(M-D-YYYY) or timestamp in milliseconds.
 *
 */



var postedSince = function() {

	this._element = '';
	// Need a 0 second catcher,so it won't fall off grid if the time difference is less than 1 second.
	this._unit = {'english':['second','second','minute','hour','day','week','month','year','ago'],
				  'chinese':['秒','秒','分鐘','小時','天','週','月','年','前']};
	this._seconds = [0,1,60,3600,86400,604800,2629744,31556926,Infinity];
	this._countStart = this._seconds.length;
	this._language = this._unit.english;
	               


	this.posted = function (time){
		input = isFinite(time) ? time : Date.parse(time) ;
		if(isNaN(input)){console.log('Unaccept datatime format:'+time); return time;}

		var diff = Math.floor((Date.now()-input)/1000);

		// The catcher that was mentioned about.
		if(diff<1) return [0,0];

		for(let j=0,lenJ=this._countStart;j<=lenJ;j++){
			if(diff<this._seconds[j]) return [Math.floor(diff/this._seconds[j-1]),j-1];
		}

		return time;
	}

	this.wrapUp = function (posted){
		var language = this._language;
	 	var amount = language[0] == 'second' && posted[0] > 1 ? 's' : '' ;
	  
	  	if(Array.isArray(posted)) return posted[0]+language[posted[1]]+amount+' '+language[language.length-1];
		return new Date(posted).toLocaleDateString();
	};

	this.notBiggerThan = function (unit){
		this._countStart = this._unit.english.indexOf(unit);
		return this;
	}

	this.language = function (lang){
		this._language = this['_unit'][lang];
		return this;
	}

	this.set = function (element){

		this._element = typeof element === 'string' ? document.querySelectorAll(element) : element;
		if(this._element instanceof NodeList||this._element instanceof HTMLCollection){

		  for(var i=0,lenI=this._element.length;i<lenI;i++){

				this._element[i]['innerText'] = this.wrapUp(this.posted(this._element[i]['innerText']));
			 }

		}else{

		  	this._element['innerText'] =  this.wrapUp(this.posted(this._element['innerText']));
		
		};
	}

}
