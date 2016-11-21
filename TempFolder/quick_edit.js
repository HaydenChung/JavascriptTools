
var sizeArr=["[size=1]","[size=2]","[size=3]","[size=4]","[size=5]"];

var fontArr=["[font=宋體]","[font=黑體]","[font=微軟雅黑]","[font=微軟正黑體]","[font=新宋體]","[font=新細明體]","[font=細明體]","[font=標楷體]"];

var buttonArr=["[align=center]","[align=left]","[align=right]","[b]","[i]","[u]","[img=image]","[youtube]","[url=url]","[youku]"];
//function will call if the element match any object's key show below.
var functionArr={"[img=image]":editorPromptImage,"[youtube]":editorPrompt,"[url=url]":editorPromptUrl,"[youku]":editorPrompt};



function quick_edit(php_response)
{
	var sqlresult=JSON.parse(php_response.responseText);


	var target=[];
	if(document.querySelector('#content') != null)
	{
		    target=document.querySelectorAll('.unlock');
	}




	var i=0,len=target.length,parent='',temp='';
	for(i;i<len;i++)
	{
		parent=target[i].parentNode;
		temp=document.createElement('textarea');
		temp.className=parent.className+'_edit';
		temp.value=sqlresult[0][parent.className];
		temp.style.width=(target[i].offsetWidth-1)+'px';
		temp.setAttribute('form','edit');
		temp.id=parent.className+'Input';
		temp.name=parent.className;
		parent.appendChild(temp);
		if(target[i].classList)
		{
			target[i].classList.add('display_none')
		}
		else
		{
			target[i].className='display_none';
		}

	}

	function edit_btn()
	{
		temp1=document.createElement('button');
		temp1.innerHTML='提交';
		temp1.setAttribute('form','edit');
		temp2=document.createElement('button');
		temp2.innerHTML='取消';
		temp2.name='cancel';
		temp3=document.createElement('form');
		temp3.id='edit';
		temp3.setAttribute('method','post');
		temp3.setAttribute('action','?page=edit');

		var x=document.querySelector('button[name=quick_edit_Button]')
		x.disabled=true;
		x.parentNode.appendChild(temp1);
		x.parentNode.appendChild(temp2);
		x.parentNode.appendChild(temp3);

		function remove_quick_edit()
		{
			for(var i=0,len=target.length;i<len;i++)
			{
				parent=target[i].parentNode;
				parent.removeChild(target[i].nextSibling);
				target[i].classList.remove('display_none');

			}
			x.disabled=false;
			for(i=0;i<3;i++)
			{
				x.parentNode.removeChild(x.nextSibling);
			}
		}
		document.querySelector('button[name=cancel]').addEventListener('click',remove_quick_edit);
	}

	resize_textarea('.內文_edit');
	addWrapper('#內文Input','editorWrapper');
	addDivBefore('#內文Input','editorBar');
	if(document.querySelector('#editorBar') != null){
		createOpt(fontArr,'#editorBar','字形');
		createOpt(sizeArr,'#editorBar','字體大小');
		createBtn(buttonArr,'#editorBar');
		insertBBcode('#內文Input','#editorBar');
	}
	edit_btn();

}


function createOpt(optionArr,wrapper,placeholder){

	var tempArr=[];
	optionArr.forEach(function(curValue,index,arr)
	{    tempArr[index]=curValue+'[/'+curValue.substr(curValue.indexOf('[')+1,(curValue.indexOf('=')-1)-curValue.indexOf('['))+']';

	})


	tempArr.forEach(function(curValue,index,arr)
		{		tempArr[index]='<option value="'+curValue+'">'+curValue.substr(curValue.indexOf('=')+1,(curValue.indexOf(']')-1)-curValue.indexOf('='))+'</option>';
		}

	)

	var temp=document.createElement('select');
	temp.innerHTML='<option selected disabled>'+placeholder+'</option>'+tempArr;
	var parent=document.querySelector(wrapper);
	parent.insertBefore(temp,parent.firstChild);

}

function createBtn(inputArr,wrapper){
	var tempArr=[];
	inputArr.forEach(function(val,index,arr){
		if(val.indexOf('=')!=-1){
			tempArr[index]=val+'[/'+val.substr(val.indexOf('[')+1,(val.indexOf('=')-1)-val.indexOf('['))+']';
		}else{
			tempArr[index]=val+'[/'+val.substr(val.indexOf('[')+1,val.indexOf(']')-val.indexOf('['));
		}

	})


	tempArr.forEach(function(val){

		var temp=document.createElement('button');
		temp.type='button';
		temp.clasName='editorBtn';
		temp.value=val;
		var string=val.indexOf('=') !=-1 ? val.substr(val.indexOf('=')+1,(val.indexOf(']')-1)-val.indexOf('=')) : val.substr(val.indexOf('[')+1,(val.indexOf(']')-1)-val.indexOf('['));
		temp.innerHTML=string;
		var parent=document.querySelector(wrapper);
		parent.appendChild(temp);

	})

}

function insertBBcode(target,toolbarField){
	var select=document.querySelectorAll(toolbarField+' select');
	var button=document.querySelectorAll(toolbarField+' button');
	var targetField=document.querySelector(target);

	if(select[0]){
		for(var i=0;i<select.length;i++){
			select[i].addEventListener('change',function(){
				insert(targetField,this.value);
				this.selectedIndex = 0;
			});
		}
	}
	if(button[0]) {
		for (var i = 0; i < button.length; i++) {
			button[i].addEventListener('click', function () {
				var elmName=this.value.substr(0,(this.value.indexOf(']')+1));
				var insertVal=this.value;
				if(functionArr[elmName]){
					insertVal=functionArr[elmName](this.value);
				}
				insert(targetField, insertVal);
			});
		}
	}

	function insert(targetField,insertValue){
		var source=targetField.value;
		var start=targetField.selectionStart;
		var result=source.substr(0,start)+insertValue+source.substr(start,source.length);
		targetField.value=result;
		targetField.selectionStart=start+insertValue.indexOf(']')+1;
		targetField.selectionEnd=start+insertValue.indexOf(']')+1;

	}
}

function editorPrompt(bbcode){
	var input=prompt("輸入連接");
	var result=bbcode.substr(0,bbcode.indexOf(']')+1)+input+bbcode.substring(bbcode.lastIndexOf('['));
	return result;
}

function editorPromptUrl(bbcode){
	var inputUrl=prompt("輸入連結");
	var inputText=prompt("輸入描述");
	var result=bbcode.substring(0,bbcode.indexOf('=')+1)+inputUrl+']'+inputText+bbcode.substring(bbcode.lastIndexOf('['));
	return result;
}

function editorPromptImage(bbcode){
	var image=prompt('輸入圖片網址');
	var text=prompt('圖片描述');
	var height='h='+prompt('圖片高度');
	var width='w='+prompt('圖片寛度');
	var result=bbcode.substring(0,bbcode.indexOf('=')+1)+image+' '+height+' '+width+']'+text+bbcode.substring(bbcode.lastIndexOf('['));
	return result;
}

function resize_textarea(targetname)
{
	if(document.querySelector(targetname) != null)
	{
		var elem = document.querySelector(targetname);
		elem.style.width = '100%';
		elem.style.height = elem.scrollHeight + 'px';

		function reheight() {
			elem.style.height = 'auto';
			elem.style.height = elem.scrollHeight + 'px';
		}

		elem.addEventListener('input', reheight);
	}
}

function createUpload(appendTo,multifile){

	var multifile = typeof multifile === 'undefined' ? true : multifile ;
	var parent=document.querySelector(appendTo);
	var image=document.createElement('input');
	image.type='file';
	image.name='uploadImage[]';
	image.id='uploadImage';
	if(multifile === true){ image.multiple = true;}
	image.accept = 'image/jpeg';
	var label = document.createElement('label');
	label.htmlFor = 'uploadImage';
	label.innerHTML = '上傳圖片';
	var div = document.createElement('div');
	div.className = 'innerBox';
	div.id='uploadBox';
	div.appendChild(label);
	div.appendChild(image);
	parent.appendChild(div);
	var uploadbtn=document.createElement('button');
	uploadbtn.type='button';
	uploadbtn.innerHTML='上載圖片';
	div.appendChild(uploadbtn);

	uploadbtn.addEventListener('click',function(){
		uploadbtn.disabled=true;
		uploadbtn.innerHTML='上載中.....';
		ajaxUpload('#uploadImage');
	});

	function ajaxUpload(target){
		var filesSelect=document.querySelector(target);
		var files=filesSelect.files;
		var formData = new FormData();
		var error ='';
		//loop through files and build the formData.

		if(files.length > 9){
			alert('最多同時上載9個檔案。');
			error='Maximum total number of files exceeded.';
		}

		var cat = document.querySelector('#fieldSelect');
		var catText = cat.options[cat.selectedIndex].text;
		formData.append('class', catText);



		for(var i=0,len=files.length;i<len;i++){

			var file=files[i];

			switch(true){

				case !file.type.match('image/jpeg'):
					alert('只支援jpg/jpeg格式。');
					error='Unsupported  extensions.';
					break;
				case file.size > 1024000:
					alert('檔案大小上限為1024KB。');
					error='Exceeded filesize limit.';
					break;
				default: formData.append('upfiles[]',file);

			}

		}

		if(error===''){
			getAjax('php/uploadFile.php',function(response){
				upImgPreview(response,'#uploadBox');
				uploadbtn.disabled=false;
				uploadbtn.innerHTML='上載圖片';
			},'post',formData);
		}else{
			uploadbtn.disabled=false;
			uploadbtn.innerHTML='上載圖片';
		}

	}

	function upImgPreview(response,appendTo){

		var src=response.responseText.match(/\/upload\/.*?jpg/g);
		if(src!=null){

			var wrapper=document.createElement('div');
			wrapper.id='previewWrapper';
			wrapper.style.display='block';

			src.forEach(function(val,index){

				var tempImg=document.createElement('img');
				tempImg.alt='Preview';
				tempImg.src=val;
				tempImg.style.height= '5rem';
				tempImg.style.width='5rem';
				tempImg.style.display='inline-block';
				var text=document.createElement('div');
				text.innerHTML='圖片'+(index+1)+'位置 : '+val;
				text.style.display='inline-block';
				var box=document.createElement('div');
				box.style.display='inline-block';
				box.appendChild(tempImg);
				box.appendChild(text);
				wrapper.appendChild(box);


			})

			var parent=document.querySelector(appendTo);
			parent.appendChild(wrapper);
		}
		/*    var image=document.createElement('img');
		 image.alt = 'Preview';
		 image.src = src.responseText;
		 image.height = '300px';
		 image.width = '300px';
		 document.querySelector(appendTo).appendChild(image);
		 */

	}

}