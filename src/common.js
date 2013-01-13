// global variables.
var HASH_COMMAND = "hash";
var PAGE_FULLY_LOADED_ACTION = "init";

// classes declaration.
var Coordinate = function(x,y){
    this.x=x;
    this.y=y;
    this.equals = function(other){
        return this.x===other.x && this.y===other.y;
    }
}

var Url=function(url, posXY){
    this.url =url,
    this.posXY=posXY;
    this.equals = function(otherUrlObj){
        return this.url===otherUrlObj.url && this.posXY.equals(otherUrlObj.posXY);
    }
}

var ClickTrack=function(currUrl, clickedUrlObj ){
    this.currUrl = currUrl;
    this.clickedUrlObj = clickedUrlObj ;
}

var MessageSpec=function(command, content){
    this.command=command;
    this.content=content;
}

// utils
var _lj={
    // by meouw and animuson from http://stackoverflow.com/questions/442404/dynamically-retrieve-the-position-x-y-of-an-html-element
    findPos : function(el) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return new Coordinate(_x , _y);
    },
    createUrlObjForAnchorElem : function(anchorElem){
        var xy =_lj.findPos(anchorElem);
        return new Url(anchorElem.href, xy);
    }
}
