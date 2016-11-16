 /**
  *
  * 一個簡單的繁簡轉換功能.
  * 使用例子:   
  * 
  * var translate = new translation('字庫路徑');
  * translate->convert('來源','輸出');
  *
  *
  * @param string '字庫路徑' 字庫本身須為.js格式.
  * @param object '來源'     接受DOM元素.
  * @param object '輸出'     同上.
  *
  * @return 按輸出設定返回內容     '輸出'等於字串'return'或留空,會直接修改原有元素.否則會向'輸出'元素返回轉換後的字串.
  */

var translation = function(dictPath){

    this.dictName = dictPath.substring(dictPath.lastIndexOf("/")+1,dictPath.lastIndexOf('.js'));
    this.dictArr = [];
    this.result = '';

    //loadDict試圖從variable,localStorage或服務器取得字庫,傳遞給callback function,即replaceStr().

    this.loadDict = function(dictName,callback,cbParamA,output){

        if (this.dictArr != ''){
            this.result = callback(cbParamA,this.dictArr);
            if(output != null) output.innerText = this.result;

        }else if (typeof localStorage[dictName] != 'undefined'){

            this.dictArr=JSON.parse(localStorage[dictName]);
            this.result = callback(cbParamA,this.dictArr);
            if(output != null) output.innerText = this.result;

        }else{
            getAjax(dictPath,function(xhttp){
                this.dictArr=JSON.parse(xhttp.responseText);

                localStorage[dictName]=xhttp.responseText;
                this.result = callback(cbParamA,this.dictArr);
                if(output != null) output.innerText = this.result;

            })
        }


    }

    //遍歷傳入的字庫,搜尋目標字串中相同的字/詞,予以替換.
    this.replaceStr = function(string,dict){
        var reString = string;
        for(var i=0,lenI=dict.length;i<lenI;i++){
            reString = reString.replace(RegExp(dict[i][0],'g'),dict[i][1]);
        }
        return reString;
    }

    //把來源下所有textNode組成treeWalker並替換字/詞,用於翻譯特定區域.
    this.replaceTextNode = function(source,dict){
        var walker = document.createTreeWalker(source,NodeFilter.SHOW_TEXT,null,false);
        while(walker.nextNode()){
            if(/\S/.test(walker.currentNode.nodeValue)){
                walker.currentNode.nodeValue = this.replaceStr(walker.currentNode.nodeValue,dict);
            }
        }
    }.bind(this);

    //接口.
    this.convert = function(source,output){
        output = typeof output == 'undefined' ? 'return' : output ;
        if(output === 'return' ){
            this.loadDict(this.dictName,this.replaceTextNode,source,null);
        }else{
            this.loadDict(this.dictName,this.replaceStr,source.innerText,output);
        }

    }

    //ajax功能.
    function getAjax(url,callback,method,postvalue)
    {
    
    var xhttp= new Object();

    switch(true)
    {
        case (typeof XMLHttpRequest  !== 'undefined'): xhttp = new XMLHttpRequest(); 
        break;
        case (typeof ActiveXObject  !== 'undefined'): xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        break;
        default: console.log('Browser not support Ajax.'); return;
    
    }

    xhttp.onreadystatechange= function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
                {
                    callback(xhttp);
                }           
        }

    xhttp.open( (typeof method !== 'undefined' ? method :'GET') ,url,true);
    xhttp.send( (typeof postvalue !== 'undefined' ? postvalue :'') );

    }

}