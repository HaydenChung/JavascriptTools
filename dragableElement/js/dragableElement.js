

/*
 * An object that monitor order change of provided items
 *
 * @param itemName  Name attribute of the item's container element
 * @param indexName [optional] Name attribute of the item's identify element inside that container
 *
 */
    var Carriage = function(itemName,indexName){

        this._itemName  = itemName;
        this._indexName = typeof indexName == 'string' ? indexName: undefined;
        this._allItems = {};

        this.resort = function(){
            if(!this._indexName) return;
            var itemsList = this.getList();
            var that = this;
            Object.keys(itemsList).forEach(function(key){
                itemsList[key].querySelector('[name="'+this._indexName+'"]').innerText = parseInt(key)+1;
            }.bind(this));
        }.bind(this);

        this.getList = function(){
            return this._allItems = document.querySelectorAll('[name="'+this._itemName+'"]');
        }.bind(this);

        this.getPos = function(item){
            var list = this.getList();
            return [].indexOf.call(list,item);
        }.bind(this);

        this.getItem = function(currItem){
            while(currItem = currItem.parentNode){
                if(currItem.getAttribute('name') == this._itemName) break;
            }
            return currItem;
        }.bind(this);

        this.up = function(ev){
            var item = this.getItem(ev.target);
            var pos = this.getPos(item);
            this.to(ev,pos,pos);
        }.bind(this);

        this.down = function(ev){
            var item = this.getItem(ev.target);
            var pos = this.getPos(item);
            this.to(ev,pos+2,pos);
        }.bind(this);

        this.to = function(ev,num,currPos){

            var itemsList = this.getList();
            var currItem = this.getItem(ev.target);
            var parentItem = currItem.parentNode;
            var pos = typeof currPos == 'undefined' ? this.getPos(currItem) : currPos;

            //I need to twist the input, as insertBefore will remove the item before it insert.(which mess the fields position)
            if(num > pos) num++;

            if(num<=0 || num>= itemsList.length+2) return;

            //Exception case for last element
            if(num == itemsList.length+1){
                parentItem.insertBefore(currItem,itemsList[itemsList.length-1].nextSibling);
            }

            parentItem.insertBefore(currItem,itemsList[num-1]);
            this.resort();
        }
    };

/*
 * 
 * The factory monitor user's drag and drop action on the products it created, and resort/reposition their position in the container.
 * Need an carrier object to help it monitor
 *
 * @param factoryName   Name attribute of the products, can be access in the add() function with this._factoryName
 * @param container     String of a CSS select pattern or a html nodeElement
 * @param carrierObj    Carrer object use to monitor the position change of the items
 *
 */

    var CMSItemFactory = function(factoryName,container,carrierObj){

        if(!(carrierObj instanceof Carriage)) throw "Unaccept carrier for CMSItemFactory "+carrierObj;

        this._factoryName = factoryName;
        this._container = typeof container == 'string' ? document.querySelector(container) : container ;
        this._carry = carrierObj;
        this._itemId = 0; //unique id for every item


        //create init elements

        this._textInput = document.createElement('input');
        this._textInput.type = 'text';

        this._btn = document.createElement('button');
        this._btn.type = 'button';

        this._displayIndex = function(index){
            var displayIndex = document.createElement('div');
            displayIndex.setAttribute('name','position');
            displayIndex.innerText = index;
            return displayIndex;
        }.bind(this);

        this._removeBtn = function(){
            var removeBtn = this._btn.cloneNode(false);
            removeBtn.setAttribute('name','removeBtn');
            removeBtn.innerText = "Remove";
            removeBtn.addEventListener('click',this.remove);
            return removeBtn;
        }.bind(this);

        this._moveUpBtn = function(){
            var moveUpBtn = this._btn.cloneNode(false);
            moveUpBtn.setAttribute('name','moveUpBtn');
            moveUpBtn.innerText = "UP";
            moveUpBtn.addEventListener('click',this._carry.up);
            return moveUpBtn;
        }.bind(this);

        this._moveDownBtn = function(){
            var moveDownBtn = this._btn.cloneNode(false);
            moveDownBtn.setAttribute('name','moveDownBtn');
            moveDownBtn.innerText = "DOWN";
            moveDownBtn.addEventListener('click',this._carry.down);
            return moveDownBtn;
        }.bind(this);

        this._nivBox = function(){
            var nivBox = this._textInput.cloneNode(false);
            //Use 'class' instead of 'name' because the element is an input field,
            //but it shouldn't be included when the form submit
            nivBox.classList.add('nivBox');
            nivBox.addEventListener('keypress',(function(ev){
                if(ev.keyCode!=13) return;
                ev.preventDefault();
                this._carry.to(ev,ev.target.value);
                ev.target.value= '';
            }.bind(this)))
            nivBox.addEventListener('change',(function(ev){
                this._carry.to(ev,ev.target.value);
                ev.target.value = '';
            }.bind(this)));
            return nivBox;
        }.bind(this);
        

        //Available methods

        this.remove = function(ev){
            var currItem = this._carry.getItem(ev.target);
            var parentItem = currItem.parentNode;

            if(this._carry.getList().length == 1){
                alert('Do not remove the last item.');
                return;
            }

            var returnElm = parentItem.removeChild(currItem);
            this._carry.resort();
            return returnElm;

        }.bind(this);

        this.removeLast = function(){
            var allItems = this._carry.getList();
            if(allItems.length === 1){
                alert('Do not remove the last item');
                return;
            }
            var lastItem = allItems[allItems.length-1];
            return lastItem.parentNode.removeChild(lastItem);
        }.bind(this);

        this.addPreview = function(source,name,fileSize,appendTo){
            var field = typeof appendTo == 'string' ? document.querySelector(appendTo) : appendTo ,
            wrapper = document.createElement('div'),
            previewName = document.createElement('p'),
            previewFileSize = document.createElement('p'),
            image = document.createElement('img'),
            cross = document.createElement('span');

            wrapper.classList.add('imageDiv');
            wrapper.style.position = 'relative';
                
            wrapper.setAttribute('data-imageSrc',source);
            wrapper.addEventListener('click',inputFactory.add.bind(null,source,[]));
            previewName.innerText = name;
            previewName.style.marginBottom = '1px';
            previewFileSize.innerText = fileSize+'.KB';
            previewFileSize.style.marginTop = '1px';
            image.src = source;

            //The unlink image button
            cross.innerText = '✖';
            cross.style.background = 'red';
            cross.style.position = 'absolute';
            cross.style.top = '1rem';
            cross.style.right = '0';
            cross.style.color = 'white';
            cross.style.fontSize = '1rem';
            cross.style.width = '1.5rem';
            cross.style.height = '1.5rem';
            cross.style.cursor = 'pointer';
            cross.style.textAlign = 'center';
            cross.style.lineHeight = '1.5rem';
            cross.classList.add('unlinkImgBtn');

            wrapper.appendChild(previewName);
            wrapper.appendChild(previewFileSize);
            wrapper.appendChild(image);
            wrapper.appendChild(cross);
            
            field.appendChild(wrapper);
            return wrapper;
        }.bind(this);

    }



var carry = new Carriage('inputField','position');
var inputFactory = new CMSItemFactory('inputField','#itemContainer',carry);

CMSItemFactory.prototype.add = function(imgSrc,textSrc){

        var allWrapper = this._container.querySelectorAll('[name="'+this._factoryName+'"]'),
        index = allWrapper.length, //Live index for this new element
        inputTextName = "content-item",
        imageSrcName = "image-src",
        wrapper = document.createElement('div'),
        label = document.createElement('label'),
        displayIndex = this._displayIndex(index+1),
        enTextInput = this._textInput.cloneNode('input'),
        zhTextInput = this._textInput.cloneNode('input'),
        imageSrc = document.createElement('input'),
        br = document.createElement('br'),
        img = document.createElement('img');

        wrapper.setAttribute('name',this._factoryName);

        label.htmlFor = inputTextName+this._itemId;

        enTextInput.id = 'en-'+inputTextName+this._itemId;
        enTextInput.name = 'en-'+inputTextName+'[]';
        enTextInput.value = typeof textSrc.en == 'undefined' ? '' : textSrc.en;
        enTextInput.classList.add('content-items');

        zhTextInput.id = 'zh-'+inputTextName+this._itemId;
        zhTextInput.name = 'zh-'+inputTextName+'[]';
        zhTextInput.value = typeof textSrc.zh == 'undefined' ? '' : textSrc.zh;
        zhTextInput.classList.add('content-items');

        if(textSrc.zhUrl){
            var enUrlInput = this._textInput.cloneNode(false),
            zhUrlInput = this._textInput.cloneNode(false);

            enUrlInput.id = 'en-link'+this._itemId;
            zhUrlInput.id = 'zh-link'+this._itemId;

            enUrlInput.name = 'en-link[]';
            zhUrlInput.name = 'zh-link[]';

            enUrlInput.value = typeof textSrc.enUrl == 'undefined' ? '' : textSrc.enUrl;
            zhUrlInput.value = typeof textSrc.zhUrl == 'undefined' ? '' : textSrc.zhUrl;

            enUrlInput.classList.add('content-items');
            zhUrlInput.classList.add('content-items');
        }

        imageSrc.type = 'hidden';
        imageSrc.name = imageSrcName+'[]';
        imageSrc.value = typeof imgSrc == 'undefined' ? '' : imgSrc;

        var nivBox = this._nivBox(),
        removeBtn = this._removeBtn(),
        moveUpBtn = this._moveUpBtn(),
        moveDownBtn = this._moveDownBtn();

        img.src = typeof imgSrc == 'undefined' ? '' : imgSrc;

        label.appendChild(displayIndex);
        label.appendChild(enTextInput);
        label.appendChild(zhTextInput);
        if(textSrc.zhUrl){
            label.appendChild(enUrlInput);
            label.appendChild(zhUrlInput);
        }
        label.appendChild(imageSrc);
        label.appendChild(removeBtn);
        label.appendChild(moveUpBtn);
        label.appendChild(nivBox);
        label.appendChild(moveDownBtn);
        label.appendChild(br);
        label.appendChild(img);
        wrapper.appendChild(label);

        if(this._itemId == 0){
            this._container.appendChild(wrapper);
        } else {
            allWrapper[0].parentNode.appendChild(wrapper);
        }

        img.addEventListener('mousedown',down);

        this._itemId++;
        return wrapper;
    }.bind(inputFactory);

//Select elements on the page and bind event.Require a class of their own.....when I have time......
    var lastDelBtn = document.querySelector('#removeLastImg'),
    uploadBtn = document.querySelector('#uploadBtn'),
    imageUploadArea = document.querySelector('#imageUpload'),
    previewFieldWrapper = document.querySelector('#imageDisplayWrapper'),
    sectionName = document.querySelector('#submit').value;

    lastDelBtn.addEventListener('click',inputFactory.removeLast);
    uploadBtn.addEventListener('click',function(ev){
        uploadImageEvent(
            '#uploadField',
            '../includes/core/ajaxQuery.php?action=uploadImg&page='+sectionName+'&token='+ev.target.value,
            ev.target,
            previewFieldWrapper
        );
    });

//build inputFileds with the factory.
    Object.keys(inputField[sectionName]).forEach(function(key){
        inputFactory.add(
            inputField[sectionName][key]['image-src'],{
                en:inputField[sectionName][key]['en-content-item'],
                zh:inputField[sectionName][key]['zh-content-item'],
                enUrl:inputField[sectionName][key]['en-link'] || undefined,
                zhUrl:inputField[sectionName][key]['zh-link'] || undefined
            }
        );
    });

//build image previewFields(where it display all images in the pool) with factory.
    Object.keys(previewDatas).forEach(function(key){
        inputFactory.addPreview(previewDatas[key]['src'],previewDatas[key]['name'],previewDatas[key]['fileSize'],previewFieldWrapper);
    })

//bind unlinkImageEvent evnet to the trigger element(red cross) in previewField
    var previewFields = document.querySelectorAll('.imageDiv'),
    unlinkToken = previewFieldWrapper.getAttribute('data-unlink-token');
    Object.keys(previewFields).forEach(function(key){
        var unlinkBtn = previewFields[key].querySelector('.unlinkImgBtn');
        var imagePath = previewFields[key].getAttribute('data-imagesrc');
        bindUnlink(previewFields[key],unlinkBtn,imagePath,unlinkToken);
    });

/*
 *This function upload files(images) to ajaxQuery.php thought post,then use the returned responseText to create a previewField.
 *
 * @param   targetField     Source of the files,the <input type="file"> element
 * @param   uploadTo        The upload url,with original url and variable(action=uploadImg,page=sectionName,token)
 * @param   triggerElm      Button that trigger the event,function will disable it as before the ajax response.
 * @param   reviewField     Container element where the preview will append to.
 * 
 * @return  null            null
 *
 */
    function uploadImageEvent(targetField,uploadTo,triggerElm,reviewField){
        var formData = new FormData(),
        uploadField = typeof targetField == 'string' ? document.querySelector(targetField) : targetField,
        files = uploadField.files,
        error = '';

        if(files.length <= 0){
            alert('Please select file to upload.');
            return;
        }

		if(files.length > 9){
			alert('Maximum capacity is 9 files');
			error='Amount of files reach capacity';
		}

        for(var i=0,lenI=files.length;i<lenI;i++){
            var file = files[i];
            if(!file.type.match(/image\/.+/g)){
                alert('Unaccept file type: '+file.type);
				error='Unsupported extensions.';
            }else{
                formData.append('upFiles[]',file);
            }
        }

        if(error===''){
            triggerElm.disabled = true;
            triggerElm.innerHTML = "Uploading....";     
            ajaxQuery(
                uploadTo,
                function(response){
                    var result = JSON.parse(response.responseText);
                    //prepare for unlink event
                    var unlinkToken = document.querySelector('#imageDisplayWrapper').getAttribute('data-unlink-token');
                    Object.keys(result).forEach(function(key){
                        var currentElm = inputFactory.addPreview(result[key]['src'],result[key]['fileName'],result[key]['fileSize'],reviewField);
                        var unlinkBtn = currentElm.querySelector('.unlinkImgBtn');
                        bindUnlink(currentElm,unlinkBtn,result[key]['src'],unlinkToken);
                    });
                    triggerElm.disabled = false;
                    triggerElm.innerHTML = "Upload Image";
                    uploadField.value = '';
                },
                "POST",
                formData
            );
        }
    }

//Remove image for the pool,post a request to ajaxQuery.php,remove the previewField if unlink successed.
    function unlinkImageEvent(previewField,url){

        var confirmation = confirm('Are you sure to delete this image?');
        if(confirmation !== true){
            return false;
        }

        var whiteBlock = document.createElement('div');
        whiteBlock.style.background = 'white';
        whiteBlock.style.opacity = '0.5';
        whiteBlock.style.width = '100%';
        whiteBlock.style.height = '100%';
        whiteBlock.style.position = 'absolute';
        whiteBlock.style.zIndex = 9;
        whiteBlock.style.top = 0;
        whiteBlock.style.left = 0;

        var parentElm = previewField.parentNode;

        parentElm.appendChild(whiteBlock);

        ajaxQuery(
            url,
            function(response){
                var result = JSON.parse(response.responseText);
                if(result===true){
                    parentElm.removeChild(previewField);
                }else{
                    alert('Failed to remove image.');
                }
                parentElm.removeChild(whiteBlock);
            }
        )
    }

    function bindUnlink(field,triggerElm,imagePath,token){
        var imageName = imagePath.split('/').pop();
        triggerElm.addEventListener('click',function(ev){
            ev.stopPropagation();
            unlinkImageEvent(field,'../includes/core/ajaxQuery.php?action=unlinkImg&page='+sectionName+'&token='+token+'&filename='+imageName);
        });
    }

//Move inputField functions,dragable by mouse.Use the carrier object to change their order.
    var startX=0;
    var startY=0;
    var activeX = 0;
    var activeY = 0;
    var currElm = {};
    var currEv = {};
    var active = false;
    var animate = '';

    function down(e){
        // e.preventDefault();
            window.addEventListener('mousemove',move);
            window.addEventListener('mouseup',desist);
            currElm = carry.getItem(e.target);
            currEv = e;
            startX=e.clientX;
            startY=e.clientY;

    }

    function move (e){
            e.preventDefault();
            activeX = e.clientX;
            activeY = e.clientY;
            if(active == false){
                transPerFarme();
                active = true;
            }
    }

    function transPerFarme(){
        currElm.style.transform = "translate("+(activeX-startX)+"px,"+(activeY-startY)+"px)";
        //
        animate = window.requestAnimationFrame(transPerFarme);
    }

    function desist (e){
            e.preventDefault();
            window.removeEventListener('mousemove',move);
            window.removeEventListener('mouseup',desist);
        if(active == true){
            window.addEventListener('mouseover',put);
            window.cancelAnimationFrame(animate);
            currElm.style.transform = 'initial';
        }
    }

    function put(e){
        window.removeEventListener('mouseover',put);
        active = false;
        var pos=carry.getPos(carry.getItem(e.target));
        if(pos < 0) return;
        carry.to(currEv,pos+1);
    }


