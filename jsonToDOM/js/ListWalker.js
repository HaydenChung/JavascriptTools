var ListWalker = function(){

    /**
     * A customized tree walker.
     *
     * @param   source      The source of the list,could be a UL element or it's wrapper.
     * @param   callback    Invoke for every HTML element inside 'source'.
     *
     * @return  boolen      Return the last element it walk through.
     *
     */
    this.nodeWalker = function(source,callback) {
    //Start diving.
    var node=source.firstChild;
        while(node != null){
            //If we are not in a element's node,use the callback to do something with it.
            if(node.nodeType == 1)  callback(node);

            if(node.hasChildNodes()){
                //Go deeper.
                node = node.firstChild;
            } else {
                while (node.nextSibling == null) {
                    //Next node object is null,end of level,float to the upper level.
                    node = node.parentNode;
                    if(node == source) {
                        //We already back to the surface,return.
                        return true;
                     }
                }
            //After checking current node,floats or sink,and we already know we are not at the end of level,walk to the next node.
            node = node.nextSibling;
            }
        }
    //We should never be here,something went wrong,return.
    return false;
    }


    /**
     * Walk through direct children of an UL element.
     *
     * @param   source      The source of the list,could be a UL element or it's wrapper.
     * @param   callback    Invoke for every HTML element inside 'source'.
     *
     * @return  boolen      Return the last element it walk through.
     **/
    this.listedSibling = function(source,callback) {
        //Dive into the children's level.
        var node= source.firstChild;
        while(node != null ){
            if(node.nodeType == 1) callback(node);

            //By standard,an UL element shouldn't never be another UL's direct child,it should always wrap with a LI element.
            //What we're trying to do here,is to check if we are diving in the Listed item's level,
            //if we reach any UL element,we should crack it open and dive into it.
            if(node.tagName == "UL" && node.firstChild != null){
                node = node.firstChild;
            }else{ 
            //End of level,return
            if(node.nextSibling == null){
                return node;
            }
            //There is new node ahead,walk to it.
            node = node.nextSibling;
            }
        }
    return false;
    }    
}
