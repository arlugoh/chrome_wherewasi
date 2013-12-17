// global variables.
var LINK_CLICKED_SIGNAL = "msg.CToB.linkedClicked";
var PAGE_LOADED_SIGNAL    = "msg.BToC.pagedLoaded";
var FLASH_THE_LINK = "msg.BToC.flash";

var ALWAYS_ON="alwaysOn";
var PER_CLICK = "perClick";

var WHEN_TO_TRIGGER_CONFIG_KEY  = "config.whenToTrigger";

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

var MessageSpec=function(whatsup, content){
    this.whatsup=whatsup;
    this.content=content;
}

// utils
var _lj={
    // by meouw and animuson from http://stackoverflow.com/questions/442404/dynamically-retrieve-the-position-x-y-of-an-html-element
    findPos : function(el) {
//        var _x = 0;
//        var _y = 0;
//        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
//            _x += el.offsetLeft - el.scrollLeft;
//            _y += el.offsetTop - el.scrollTop;
//            el = el.offsetParent;
//        }
//        return new Coordinate(_x , _y);
        return new Coordinate(el.documentOffsetLeft, el.documentOffsetTop);
    },
    createUrlObjForAnchorElem : function(anchorElem){
        var xy =_lj.findPos(anchorElem);
        return new Url(anchorElem.href, xy);
    }
}
