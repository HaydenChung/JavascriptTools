var TableBuilder = function(source){
    this._source = source;
    this._table = document.createElement('table');
    this._caption = document.createElement('caption');
    this._tr = document.createElement('tr');
    this._td = document.createElement('td');
    this._th = document.createElement('th');
    this._thead = document.createElement('thead');
    this._tbody = document.createElement('tbody');
    this._tfoot = document.createElement('tfoot');
    this._rowAttr = null;
    this._hiddenCols = null;
    this._headerArray = null;

    this._resizeTimer = null;
    this._windowWidth = null;
    
    this._product = null;

    this.build = function(title){

        //Terminal the function if this._source is not an object(/array).
        if(typeof this._source != 'object') return;
        var sample = this._headerArray === null ? this._source[Object.keys(this._source)[0]] : this._headerArray ;
        if(typeof sample == 'undefined') throw 'Unable to defined hander row for table builder!';
        var headerRow = this.create('tr');
        Object.keys(sample).forEach(function(key){
            if(this._hiddenCols != null && this._hiddenCols.indexOf(key) != -1) return; //builder want to hide this item,return.
            //If user haven't provide a array for headers, the key of the sample row will be use as headers, otherwise use the provided array's items.
            if(this._headerArray != null) key = sample[key];
            headerRow.appendChild(this.create('th',key));
        }.bind(this));
        var thead = this.create('thead',headerRow);
      
        var tempTr = {};
        var tempTd = {};
        var tBody  = this.create('tbody');

        Object.keys(this._source).forEach(function(rowKey){
            var rowAttr = {};
            if(this._rowAttr != null){
                Object.keys(this._rowAttr).forEach(function(attrKey){
                    rowAttr[attrKey] = this._source[rowKey][this._rowAttr[attrKey]];
                }.bind(this))
            }
            tempTr = this.create('tr', null, rowAttr);
            Object.keys(this._source[rowKey]).forEach(function(fieldKey){
                if(this._hiddenCols != null && this._hiddenCols.indexOf(fieldKey) != -1) return;
                tempTd = this.create('td', this._source[rowKey][fieldKey]);
                tempTr.appendChild(tempTd);
            }.bind(this))
            tBody.appendChild(tempTr);
        }.bind(this))
        var table = this.create('table');

        if(typeof title != 'undefined'){
            var caption = this._caption.cloneNode();
            caption.innerText = title;
            table.appendChild(caption);
        }
        table.appendChild(thead);
        table.appendChild(tBody);
        this._product = table;
        return table;
    }.bind(this)

    this.setAttr  = function(elmName, attr){
        Object.keys(attr).forEach(function(key){
            this['_'+elmName].setAttribute(key, attr[key]);
        }.bind(this));
        return this;
    }.bind(this);

    this.setHeader = function($array){
        this._headerArray = $array;
        return this;
    }

    /*
     * Set attributes base on source's data to every table-row individually.
     * 
     * @param   object  indexName   An object with object key as attribute's name, value as source's field's name.
     *                              The function will set data row's field value as attribute value. eg. {'key/attrNameA':'value/fieldNameA','key/attrNameB':'value/fieldNameB'}
     * 
     * @return  object  Return the object itself.
     */

    this.setRowAttr = function(indexName){
        this._rowAttr = indexName;
        return this;
    }.bind(this);

    /*
     * Add a column fill with the given value.
     * 
     * @param   object          header  Text of the th element.
     * @param   object/string   value   Inner of the td elements, accept string or html node.
     * 
     * @return  object  Return the object itself.
     */

    this.addCol = function(header, value){
        if(typeof value == 'object' && value != null){
            Object.keys(this._source).forEach(function(key){
                this._source[key][header] = value.cloneNode(true);
            }.bind(this))
        }else{        
            Object.keys(this._source).forEach(function(key){
                this._source[key][header] = value;
            }.bind(this));
        }

        return this;
    }

    /*
     * Hide a column of fields from the source.(the given column will exclude from the table)
     * 
     * @param   string  columnName  index/key of the field.
     * 
     * @return  object  Return the object itself.
     */

    this.hideCol = function(columnName){
        if(this._hiddenCols == null) this._hiddenCols = [];
        this._hiddenCols.push(columnName);
        return this;
    }

    this.setFixHeader = function() {
        
    }.bind(this);

    this.fixTableWidth = function(table) {
        var allTh = table.querySelectorAll('tr th');
        var sampleTds = table.querySelectorAll('tbody tr:first-child td');
    
        var tbody = table.querySelector('tbody');
        var tWidth = tbody.getBoundingClientRect().width;
        var thead = table.querySelector('thead');
        var caption = table.querySelector('caption');

        var extraHeight = thead.getBoundingClientRect().height+ caption.getBoundingClientRect().height; 
        var tHeight = table.parentNode.getBoundingClientRect().height - extraHeight;
        var currTotalWidth = 0;
        var currWidthArr = [];
    
        tbody.style.height = tHeight+'px';
    
        Object.keys(sampleTds).forEach(function(key) {
            currWidthArr[key] = sampleTds[key].getBoundingClientRect().width;
            currTotalWidth += sampleTds[key].getBoundingClientRect().width;
        });
        var addionWidth = (tWidth - currTotalWidth)/sampleTds.length;
        var tdWdithArr = [];
        Object.keys(sampleTds).forEach(function(key) {
            currWidthArr[key] += addionWidth;
            //shorten the last td to avoid collion with the scrollbar 
            if(key == sampleTds.length-1) {
                sampleTds[key].style.width = (currWidthArr[key] - (tbody.offsetWidth - tbody.clientWidth)) + 'px';
                return;
            }
            sampleTds[key].style.width = currWidthArr[key]+'px';
        });
        Object.keys(allTh).forEach(function(key) {
            allTh[key].style.width = currWidthArr[key]+'px';
        })
    }.bind(this);

    this.fixTableOnResizeHandler = function(ev){
        clearTimeout(this._resizeTimer);
        var that = this;
        this._resizeTimer = setTimeout(function(){
            if(that._windowWidth === window.innerWidth) return;
            that._windowWidth = window.innerWidth;
            that.fixTableWidth(that._product);
        },100);
    }.bind(this);

    this.createToTopBtn = function() {
        var button = document.createElement('div');
        var icon = document.createElement('i');
    
        button.className = 'back-to-top-btn';
    
        icon.className = 'material-icons';
        icon.innerText = 'vertical_align_top';
    
        button.appendChild(icon);
    
        button.addEventListener('click',function(ev){
            ev.preventDefault();
    
            var tableNode = ev.target;
            while(tableNode.tagName != 'TABLE') tableNode = tableNode.parentNode;
    
            $(tableNode.querySelector('tbody')).animate({
                scrollTop: 0
            }, 700);
        });

        var styles = {'position':'absolute','bottom':'1rem','right':'2rem','cursor':'pointer','color':'grey','display':'none'};
        Object.keys(styles).forEach(function(key){
            button.style[key] = styles[key];
        })

        return button;
    }
    
    /**
     * Could only invoke after the build() function, which fix the table header's position on scrolling.
     * The table's parent element need to have a height attribute to make this position correctly.
     * 
     */
    this.initFixTable = function() {
        if(this._product === null) throw 'Error: initFixTable() could only invoke after the table creation!';
        var table = this._product;
        var parent = table.parentNode;
        
        // parent.style.height = '100%';
        parent.style.overflowY = 'hidden';

        table.querySelector('thead').style.display = 'block';
        var tbody = table.querySelector('tbody');
        tbody.style.display = 'block';
        tbody.style.overflow = 'auto';
        
        this.fixTableWidth(table);
        window.addEventListener('resize', this.fixTableOnResizeHandler);
        // this.fixTableOnResizeHandler();
        var toTopBtn = table.appendChild(this.createToTopBtn());

        tbody.addEventListener('scroll', function(ev){
            var target = ev.target;

            if(target.scrollTop > target.clientHeight && toTopBtn.style.display != 'block'){

                toTopBtn.style.display = 'block';
                return;
            }
            if(target.scrollTop < target.clientHeight && toTopBtn.style.display != 'none'){
                toTopBtn.style.display = 'none';
                return;
            }
        });
        
    }.bind(this);

    /*
     * Create and return a html element.
     * 
     * @param   string           elmName   Tag name of the new element.
     * @param   string/htmlNode  inner     [Option] textContent or child of the new element.
     * @param   object           altAttr   [Option] Alternative to this.setAttr(),the given object will translate to attributes which only apply to this individual element.
     *
     */

    this.create = function(elmName, inner, altAttr){
        var elm = this['_'+elmName].cloneNode();
        if(typeof altAttr != 'undefined') Object.keys(altAttr).forEach(function(key){ elm.setAttribute(key, altAttr[key]); });
        if(typeof inner == 'undefined') return elm;
        typeof inner === 'object' && inner != null ? elm.appendChild(inner) : elm.textContent = inner ;
        return elm;
    }.bind(this);

}
