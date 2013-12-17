/**
 *  WhereWasI , a Chrome extension.
 *  
 * @author LJ sdlockloo@gmail.com
 */

var highlightCssClass='ljbalahbababah'; // yep, that's a pretty unique name.
var highlightCssClassRegex = RegExp(highlightCssClass);
var curWhereWasI;
var whenToTriggerconfig;

// http://stackoverflow.com/questions/442404/dynamically-retrieve-the-position-x-y-of-an-html-element by ThinkingStiff
window.Object.defineProperty( Element.prototype, 'documentOffsetTop', {
    get: function () { 
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop : 0 );
    }
} );

window.Object.defineProperty( Element.prototype, 'documentOffsetLeft', {
    get: function () { 
        return this.offsetLeft + ( this.offsetParent ? this.offsetParent.documentOffsetLeft : 0 );
    }
} );

(function init(){
    String.prototype.lj_format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
})();

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.whatsup === PAGE_LOADED_SIGNAL){
        initPage(request);
    } else if(request.whatsup === FLASH_THE_LINK){
        flashTheTargetAgain();
    }
});

function addCSSStyle(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ("@-webkit-keyframes {0} {from { opacity: 1.0; } to { opacity: 0.0; background-color:green;} } .{1} {-webkit-animation-name: {0};"+
    " -webkit-animation-iteration-count: 2; -webkit-animation-timing-function: cubic-bezier(1.0,0,0,1.0);  -webkit-animation-duration: 1s; }")
    .lj_format(highlightCssClass+"_blink_animation", highlightCssClass);
    document.getElementsByTagName('head')[0].appendChild(style);
}

function sendMsgToBackGround(clicked){
    urlobj = _lj.createUrlObjForAnchorElem(clicked);
    clickTrack = new ClickTrack(document.URL, urlobj);
    msg = new MessageSpec(LINK_CLICKED_SIGNAL,clickTrack);
    chrome.extension.sendMessage(msg);
}

function highlight(linkObject){
    linkObject.className += ' '+highlightCssClass;
}

function deHighlight(linkObject){
    linkObject.className = linkObject.className.replace(highlightCssClassRegex,'');
}

function flashTheTargetAgain(){
    if(typeof curWhereWasI=="undefined" || curWhereWasI==null)
        return;
//    var rect = curWhereWasI.getBoundingClientRect();
    window.scrollTo(0,curWhereWasI.documentOffsetTop-window.innerHeight/9);
    var newOne = curWhereWasI.cloneNode(true);
    deHighlight(newOne);
    highlight(newOne);
    curWhereWasI.parentNode.replaceChild(newOne, curWhereWasI);
    curWhereWasI = newOne;
}

function addATagEventAndHighlightLastClicked(request) {
    var links = document.getElementsByTagName("a");
    var urlObj=request.content.urlObj;
    whenToTriggerconfig = request.content[WHEN_TO_TRIGGER_CONFIG_KEY];
    var currLinkObj;
    for ( var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function() {
            if(curWhereWasI!=null)
                deHighlight(curWhereWasI);
            sendMsgToBackGround(this);
            // highlight before leaving the page.
            if(whenToTriggerconfig !=null && whenToTriggerconfig==ALWAYS_ON){
                highlight(this);
            }
        }, false);
        currLinkObj = _lj.createUrlObjForAnchorElem(links[i]);
        if (urlObj != null && currLinkObj.equals(urlObj)) {
            curWhereWasI = links[i];
            if(whenToTriggerconfig !=null && whenToTriggerconfig==ALWAYS_ON){
                highlight(links[i]);
            }
        }
    }
}

function initPage(request){
    addCSSStyle();
    addATagEventAndHighlightLastClicked(request);
}
