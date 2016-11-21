
/**
 * Resize images to fit it's container
 *
 * @param string/object => source
 *
 */


function reizeImg(source){
	let img = typeof source == 'string' ? document.querySelectorAll(source) : source ;

	if(img instanceof NodeList||img instanceof HTMLCollection){
		for(let i=0,lenI=img.length;i<lenI;i++){
			resize(img[i]);
		}
	} else {
		resize(img);
	}
	
	function resize(image){

		let naturalWidth = image.width,
			naturalHeight = image.height,
			targetWidth = image.parentNode.clientWidth,
			targetHeight = image.parentNode.clientHeight;

		if(naturalWidth/naturalHeight>targetWidth/targetHeight){
			image.style.width = targetWidth+"px";
		}else{
			image.style.height = targetHeight+"px";
		}
	}
}