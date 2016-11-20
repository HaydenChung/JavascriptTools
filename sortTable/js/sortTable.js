/**
 *
 * Sort HTML tablerow/div group with selected child node value.
 *
 * var sortFunction = new sortTable(rowElem,sortBy[,order]);
 * sortFunction.settle([toggle]);
 *
 * @param string 			rowElm	CSS selector patterns. eg.'tr:not(:first-child)' is a useful statement,it selects all tr elements except the first one(usually the header).
 * @param string/ingeter	sortBy	Only acceapt html element's 'name' attribute or a number that refers to the node's position.Much be a direct child to 'rowElm'.
 * @param boolean			order	Optional.Ascending order if true,descending order if false.
 * @param boolean			toggle	Optional.Stop toggle asc/desc ordering if false.
 *
 */



var sortTable = function(rowElm,sortBy,order){

	this.operator=1;
	this.switch=1;

	this.word = function(a,b){
		console.log(a);
		console.log(sortBy);
  		return (this.operator*(a['children'][sortBy]['innerText'].localeCompare(b['children'][sortBy]['innerText'])))*this.switch;
  	}.bind(this);
	this.numeric = function(a,b){
		console.log(a);
		console.log(sortBy);
		return (this.operator*(a['children'][sortBy]['innerText']-b['children'][sortBy]['innerText']))*this.switch;
	}.bind(this);

	//querySelectorAll() returns a nodeList object which leak array object's method(like sort(); ),I slice() the nodeList and turn it to an array.
	this.operator = order == false ? -1 : 1 ;
	this.list = document.querySelectorAll(rowElm);
	this.listArr = Array.prototype.slice.call(this.list);

	console.log(this.list);
	console.log(this.listArr);
  
 	this.method = isFinite(this.listArr[0]['children'][sortBy]['innerText']) ? this.numeric : this.word ;

 	this.settle = function(toggle){
 	
	this.listArr.sort(this.method);
	for (let i=0,lenI=this.listArr.length;i<lenI;i++){
		this.listArr[i].parentNode.appendChild(this.listArr[i]);
	}
		if(toggle != false) this.switch = this.switch == -1 ? 1 : -1 ;
	}.bind(this);


}