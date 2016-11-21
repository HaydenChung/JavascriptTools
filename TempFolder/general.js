/**
 * Created by lastcoin on 4/8/2016.
 */
var pageCache= {'test':'checked'};

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function getURLParam(name,url){
    return decodeURIComponent((new RegExp('[?|&]'+ name + '=' +'([^&;])[&|#|;|$]').exce(url)||[null,''])[1].replace(/\+/g,'%20'))||null;
}

function resize_textarea(targetname)
{
    if(document.querySelector(targetname) != null)
    {
        var elem = document.querySelector(targetname);
        elem.style.height = elem.scrollHeight + 'px';
        elem.style.minWidth = '450px';

        function reheight() {
            elem.style.height = 'auto';
            elem.style.height = elem.scrollHeight + 'px';
        }

        elem.addEventListener('input', reheight);
    }
}


function countdownSec(frequencyInSec, duration, targetElement){
    var temp=setInterval(timer , (frequencyInSec*1000) );
    var d = duration;
    function timer(){
        d -= 1;
        targetElement.innerHTML= d ;
        if(d == 0) clearInterval(temp);


    }
}

function addWrapper(targetElm,wrapperId){
    var targets=document.querySelectorAll(targetElm);
    if(targets != null){

    var wrapper=document.createElement('span');
    wrapper.id=wrapperId;
    targets[0].parentNode.replaceChild(wrapper,targets[0]);

        for(var i=0,lenI=targets.length;i<lenI;i++){
            wrapper.appendChild(targets[i]);
        }
    }
}

function addDivBefore(target,id){

    if(document.querySelector(target)) {
        var before = document.querySelector(target).parentNode;
        var element=document.createElement('div');
        element.id = id;
        before.insertBefore(element, before.firstChild);
    }
}

function hoverHyperLink(target){

    //pick the entity items list from database whenever function is called.
    getAjax('php/itemList.php',function (ajaxResult){
        window.pageCache={ 'data':{'itemList':JSON.parse(ajaxResult.responseText) }};
        window.pageCache.data.tooltip={};
    });

    var hoverBox=document.createElement('div');
    hoverBox.style.display='none';
    hoverBox.style.position='absolute';
    hoverBox.innerHTML='Hello!';
    hoverBox.id='hoverBox';
    hoverBox.style.backgroundColor='red';
    hoverBox.style.zIndex='99';

    var targetElm=document.querySelectorAll(target);
    for(var i=0;i<targetElm.length;i++){
        targetElm[i].addEventListener('mouseenter', addHover);
        targetElm[i].addEventListener('mouseleave',removeHover);
    }

    function addHover(){
        hoverBox.innerHTML='Hello!';
        var itemList=window.pageCache.data.itemList;
        var text=this.innerText;
        for(var i=0,len=itemList.length;i<len;i++){
            if(itemList[i]['name'] == text){
                var selectedItem=itemList[i];
                break;
            }

        }

        var result;

        if(pageCache.data.tooltip[text]){

            result=pageCache.data.tooltip[text];
            hoverBox.innerHTML = result['子類'];
        }else {
            getAjax('php/ajax.php?page=' + selectedItem['parent'] + '&no=' + selectedItem['id'], function (ajaxResult) {
                result = JSON.parse(ajaxResult.responseText);
                var index = result[0]['名稱'];
                window.pageCache.data.tooltip[index] = result[0];
                hoverBox.innerHTML = result[0]['子類'];
            })

        }

        var rect = this.getBoundingClientRect();
        document.body.appendChild(hoverBox);
        hoverBox.style.display='block';
        hoverBox.style.top=rect.top+(document.body.scrollTop || document.documentElement.scrollTop)+'px';
        hoverBox.style.left=rect.left+this.offsetWidth+(document.body.scrollLeft || document.documentElement.scrollLeft)+3+'px';

    }

    function removeHover(){
        hoverBox.style.display='none';
    }

}

function resizeImg(target,maxWidth,maxHeight,fill){

    var imgs	=   typeof target === 'string' ? document.querySelectorAll(target) : target ;
    var fillBlock=   typeof fill === 'undefined' ? false : fill;

    if(imgs.length == 0) return;

    function resizeThis(){

        var oldWidth    =   this.naturalWidth;
        var oldHeight   =   this.naturalHeight;
        var reWidth     =   maxWidth;
        var reHeight    =   maxHeight;
        var widthRatio  =   maxWidth/oldWidth;
        var heightRatio =   maxHeight/oldHeight;

        if(fillBlock === true ? reWidth > (oldWidth*heightRatio) : reWidth < (oldWidth*heightRatio)){
            reHeight    =   oldHeight*widthRatio;
        }else{
            reWidth     =   oldWidth*heightRatio;
        }

        this.style.width  =   reWidth+'px';
        this.style.height =   reHeight+'px';

    }

    for(var i=0,len=imgs.length;i<len;i++){

        if(imgs[i].complete && imgs[i].naturalWidth != 0){
            resizeThis.apply(imgs[i]);
        }else{
            imgs[i].addEventListener('load',resizeThis.bind(imgs[i]));
        }

    }

}

function createModal(origImage){
    var img =   document.querySelectorAll(origImage);

    if(img.length>0){
        for(var i=0,len=img.length;i<len;i++){

            img[i].addEventListener('click',attachModal);

        }
    }


    function attachModal(){
        var modal   =   '';
        if(!(modal = document.querySelector('#modal'))){
            modal = document.createElement('div');
            modal.id = 'modal';
            var close = document.createElement('span');
            close.classList.add('mCloseBtn');
            close.innerHTML = '&times';
            var wrapper = document.createElement('div');
            wrapper.classList.add('mInnerbox');
            var mImg = document.createElement('img');
            mImg.id  = 'mImage';
            mImg.classList.add('mImage');
            var caption = document.createElement('div');
            caption.classList.add('mCaption');

            modal.appendChild(close);
            modal.appendChild(wrapper);
            wrapper.appendChild(mImg);
            wrapper.appendChild(caption);
            document.querySelector('body').appendChild(modal);
        }else{
            var close =  document.querySelector('#modal .mCloseBtn');
            var wrapper = document.querySelector('#modal .mInnerbox');
            var mImg = document.querySelector('#mImage');
            var caption = document.querySelector('#modal .mCaption');
        }

        modal.style.display = 'block';
        mImg.src = this.src;
        mImg.alt = this.alt;
        caption.innerHTML = mImg.alt;

        close.onclick=function(){
            modal.style.display = "none";
        }
    }

}

function hoverNavBar(target){

    var uList=typeof target=== 'string'?document.querySelectorAll(target):target;


    for(var i=0,len=uList.length;i<len;i++){

        uList[i].addEventListener('mouseenter',function(){
                var thisChild=this.children;
                for(var i=0,len=thisChild.length;i<len;i++){
                    if(thisChild[i].tagName==='UL'){

                        thisChild[i].classList.add('show');
                        var ChildUL=thisChild[i].children;
                        var totalHeight=0;
                        for(var a=0,len=ChildUL.length;a<len;a++){
                            totalHeight+=ChildUL[a].offsetHeight;
                        }
                        thisChild[i].style.height=totalHeight+'px';
                        break;
                    }
                }
            }
        );

        uList[i].addEventListener('mouseleave',function(){

            var thisChild=this.children;
            for(var i=0,len=thisChild.length;i<len;i++){
                if(thisChild[i].tagName==='UL'){
                    thisChild[i].style.height='0px';
                    thisChild[i].classList.remove('show');
                    break;
                }
            }
        });
    }

}

function clickNavBar(button){

    var buttonList = typeof button === 'string' ? document.querySelectorAll(button) : button ;
    var parentLI =[];       //current active li.
    var thisChild=[];       //all children inside parentLI.
    var ChildUL  =[];       //current active ul inside parentLI.
    var totalHeight=0;      //height of all element in ChildUL.


    for(var i=0,len=buttonList.length;i<len;i++){

        buttonList[i].addEventListener('click',function(){

            parentLI[i] = this.parentNode;
            thisChild[i] = parentLI[i].children;

            if(!this.classList.contains('opened')){

                this.innerHTML = '❮❮';

                for(var j=0,clen=thisChild.length;j<clen;j++){
                    if(thisChild[i][j].tagName==='UL'){

                        this.classList.toggle('opened');
                        ChildUL[i]=thisChild[i][j].children;

                        totalHeight=0;
                        for(var a=0,alen=ChildUL[i].length;a<alen;a++){
                            totalHeight+=ChildUL[i][a].offsetHeight;
                        }
                        thisChild[i][j].style.height=totalHeight+'px';

                        break;
                    }
                }
            }else{

                this.innerHTML = '❯❯';

                for(var j=0,clen=thisChild[i].length;j<clen;j++){
                    if(thisChild[i][j].tagName==='UL'){

                        this.classList.toggle('opened');
                        thisChild[i][j].style.height='0px';


                        function loop(x){
                            var input=x.children;
                            for(var k=0,klen=input.length;k<klen;k++){
                                switch (input[k].tagName){

                                    case 'LI': loop(input[k]); break;
                                    case 'UL': input[k].style.height='0px'; loop(input[k]); break;
                                    case 'DIV': input[k].innerHTML='❯❯'; input[k].classList.remove('opened'); break;

                                }

                            }

                        }

                        loop(thisChild[i][j]);

/*                        for(var a=0,alen=ChildUL[i].length;a<alen;a++){

                                if(ChildUL[i][a].tagName==='BUTTON'){
                                    ChildUL[i][a].innerHTML='+';
                                    ChildUL[i][a].classList.remove('opened');
                                }
                                if(ChildUL[i][a].tagName==='UL'){
                                    ChildUL[i][a].style.height='0px';
                                }
                        }*/
                        break;
                    }
                }
            }
        });

    }
}

function slideshow(blocks,img,animaName,animaElm,tags,preBtn,nextBtn){
    var currentIndex = 1,
        animateState = 0,
        delayPlay = 0,
        windows = document.querySelectorAll(blocks),
        tagboards = document.querySelectorAll(tags),
        images = document.querySelectorAll(img);

    for(var j=0,lenJ=tagboards.length;j<lenJ;j++){
        (function(){
            var count = j+1;
            tagboards[j].addEventListener('click',function(){	setShowing(count); play(false);	})
        }())

    }

    var widthRatio = Math.round((1/lenJ)*1000)/10;

    document.querySelector(preBtn).addEventListener('click',function(){
        moveShowing(-1,'left',true); play(false);
    });
    document.querySelector(nextBtn).addEventListener('click',function(){
        moveShowing(+1,'right',true); play(false);
    });


//show function,decide which block to show,in which direction.
//All other block assign display:none;.
    function showWin(Num,direction){
        for(var i=0,lenI=windows.length;i<lenI;i++){
            windows[i].style.display="none";

        }
        (Num<1) ? Num=lenI :'';
        (Num>lenI) ? Num=1 :'';

        var showing=windows[Num-1];

        if(!showing.classList.contains('animate-'+direction)){
            showing.classList.remove('animate-left','animate-right');
            showing.classList.add('animate-'+direction);

        }
        showing.classList.add('animate-'+direction);
        showing.style.display="block";
        currentIndex=Num;
    }

//Move function,slide the showWin x block away(back/forward) in passed-in direction.
//Could also stop the burning fuse by passing in the third argument(true/false).
    function moveShowing(num,direction,instant){
        var direction = (typeof direction !== 'undefined') ?  direction : 'right';
        var instant = (typeof instant !== 'undefined') ?  instant : false;
        showWin(currentIndex+=num,direction);
        animatedBar(currentIndex,instant);
    }

//Another move function,this one jump directly to the assigned block.
//Active it will immediately put out the fire(of the burning fuse).
    function setShowing(index){
        var direction = index >= currentIndex ? 'right' : 'left';
        showWin(index,direction);
        animatedBar(currentIndex,true);
    }

//Animated time bar,this function decide type of time bar,and build a basic structure for them.

    function animatedBar(index,instant){
        if(animaName === burnFuse){
            var param1 = widthRatio;
        }else{
            param1 = null;
        }
        animaName(animaElm,index,instant,param1);
    }
//Animated time bar's function,I call it burning fuse.
//


//Time interval function,which keep the block sliding.
//First argument could pause the sliding,it will sleep for 20 seconds than
//start sliding again.Second argument remove these behavior completely.
    function play(state,remove){
        var state = (typeof state !== 'undefined') ?  state : true;
        var remove = (typeof remove !== 'undefined') ?  remove : false;


        if(state){
            animateState = setInterval(function(){moveShowing(+1,'right')},5000);
        }else if(remove){
            clearTimeout(delayPlay);
            clearInterval(animateState);
        }else{
            clearTimeout(delayPlay);
            clearInterval(animateState);
            delayPlay = setTimeout(function(){ play();},20000)
        }
    }


    setShowing(currentIndex);
    play();
    resizeImg(images,windows[0].parentNode.offsetWidth,windows[0].parentNode.offsetHeight,true);

}

function burnFuse(elm,index,instant,widthRatio){
    var instant = (typeof instant !== 'undefined') ?  instant : false;
    var fuse=document.querySelector(elm);

    if(fuse!=null){

        if(index===1){

            fuse.classList.remove('burning');
            fuse.style.width='0px';
            fuse.offsetWidth;
        }

        if(instant===false){
            fuse.classList.add('burning');
            fuse.style.width=index*widthRatio+"%";
        }else{
            fuse.classList.remove('burning');
            fuse.style.width=index*widthRatio+"%";
            fuse.offsetWidth;
        }
    }else{
        console.log('No burning fuse provided.')
    }

}

//Another animated time bar,bring out a glowing dot.
function growBeans(elm,index,instant){
    var instant = (typeof instant !== 'undefined') ?  instant : false;
    var beans=document.querySelectorAll(elm);
    index+=-1;
    for(var b=0,lenB=beans.length;b<lenB;b++){
        beans[b].style.display = 'none';
    }
    if(instant === true){
        beans[index].classList.remove('grow');
    }else{
        beans[index].classList.add('grow');
    }

    beans[index].style.display = 'block';
}

var translation = function(dict){

    this.dictName = dict;
    this.dictArr = [];
    this.result = '';

    //loadDict試圖從variable,localStorage或服務器取得字庫,傳遞給callback function,即replaceStr().
    //*注意:getAjax為外部引用的自定義function,別忘記先行讀取.

    this.loadDict = function(dictName,callback,cbParamA,target){

        if (this.dictArr != ''){


        }else if (typeof localStorage[dictName] != 'undefined'){

            this.dictArr=JSON.parse(localStorage[dictName]);

        }else{
            getAjax('javascript/'+dictName+'.js',function(xhttp){
                this.dictArr=JSON.parse(xhttp.responseText);

                localStorage[dictName]=xhttp.responseText;
            })
        }

            this.result = callback(cbParamA,this.dictArr);
            target = this.result;

    }

    //遍歷傳入的字庫,搜尋目標字串中相同的字/詞,予以替換.
    this.replaceStr = function(string,dict){
        var reString = string;
        for(var i=0,lenI=dict.length;i<lenI;i++){
            reString = reString.replace(dict[i][0],dict[i][1]);
        }
        return reString;
    }

    //把來源下所有textNode組成成treeWalker並替換字/詞,用於翻譯特定區域.
    this.replaceTextNode = function(source,dict){
        var walker = document.createTreeWalker(source,NodeFilter.SHOW_TEXT,null,false);
        while(walker.nextNode()){
            if(/\S/.test(walker.currentNode.nodeValue)){
                walker.currentNode.nodeValue = this.replaceStr(walker.currentNode.nodeValue,dict);
            }
        }
    }.bind(this);

    //接口.
    this.convert = function(source,target){
        if(target === 'return' ){
            this.loadDict(this.dictName,this.replaceTextNode,source,null);
        }else{
            this.loadDict(this.dictName,this.replaceStr,source,target);
        }

    }
}

var foldableElement = function(elements,trigger,distanceREM){
    var elmts = document.querySelectorAll(elements);
    var click = document.querySelector(trigger);

    if(click == null || elmts == null)  return;

    var unfolded = false;

    addWrapper(elements,'quickLoginHolder');
    var wrapper = document.querySelector('#quickLoginHolder');
    wrapper.classList.add('fold_horizontal');

    for(var i=0,lenI=elmts.length;i<lenI;i++){
        elmts[i].style.width = 0;
        elmts[i].style.display = 'none';
        elmts[i].classList.add('fold_horizontal');
    }

    var fun = function(){
        if (unfolded === false){
            wrapper.style.display = 'inline-block';
            wrapper.style.width = 0;
            for(i=0;i<lenI;i++){
                elmts[i].style.display = 'inline-block';
                wrapper.offsetWidth;
                elmts[i].style.width = distanceREM+'rem';
            }
            wrapper.style.width = 'auto';
            unfolded = true;
        }else{
            wrapper.style.width = 'auto';
            for(i=0;i<lenI;i++){
                elmts[i].offsetWidth;
                elmts[i].style.width = 0;
            }
            wrapper.style.width = 'auto';
            //elements[0] should be the holder.
            unfolded = false;
        }
    }
    click.addEventListener('click',fun);
}

var setCookie = function(name,value,expireDays,path){
    this.d = new Date();
    this.d.setTime(this.d.getTime()+(expireDays*24*60*60*1000));
    this.path = typeof path === 'undefined' ? 'path=/' : 'path='+path;
    this.expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value +";" + this.expires + ";" + this.path;
}

var parallaxScroll = function (parallaxBox){
    var scrollY = 0;
    var container = cParam(parallaxBox);
    var lenI = container.length;

    if(lenI===0) return;

    window.addEventListener('scroll',function(e){
        scrollY = document.body.scrollTop;
        for(var i=0;i<lenI;i++){
            container[i].style.backgroundPosition = '0 '+(-scrollY*1.5)+'px';
        }
    })
}

var cParam = function(passIn){

    this.value = typeof passIn === 'string' ? document.querySelectorAll(passIn) : passIn;
    return this.value;

}

function duplicate(array,temp){

    if(typeof temp == 'undefined'){
        var temp={};
    }
    for(var i in array){

        if(typeof temp[array[i]]!='undefined'){
            return false;
        }

        if(typeof array[i] ==='object'){

            if(duplicate(array[i],temp)===false){
                return false;
            }

        }else{temp[array[i]]='';}
    }
    return true;
}