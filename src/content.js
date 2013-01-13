/**
 *  WhereWasI , a Chrome extension.
 *  
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 * @author LJ sdlockloo@gmail.com
 */

var highlightCssClass='ljbalahbababah';
var highlightCssClassRegex = RegExp(highlightCssClass);
var curHighlighted;

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
    if(request.command === PAGE_FULLY_LOADED_ACTION){
        addCSSStyle();
        addATagEventAndHighlightLastClicked(request);
    }
});

function addCSSStyle(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ("@-webkit-keyframes {0} {from { opacity: 1.0; } to { opacity: 0.0; background-color:green;} } .{1} {-webkit-animation-name: {0};"+
    " -webkit-animation-iteration-count: 3; -webkit-animation-timing-function: cubic-bezier(1.0,0,0,1.0);  -webkit-animation-duration: 1s; }")
    .lj_format(highlightCssClass+"_blink_animation", highlightCssClass);
    document.getElementsByTagName('head')[0].appendChild(style);
}

function sendMsgToBackGround(clicked){
    urlobj = _lj.createUrlObjForAnchorElem(clicked);
    clickTrack = new ClickTrack(document.URL, urlobj);
    msg = new MessageSpec(HASH_COMMAND,clickTrack);
    chrome.extension.sendMessage(msg);
}

function highlight(linkObject){
    linkObject.className += ' '+highlightCssClass;
    curHighlighted = linkObject;
}

function deHighlight(linkObject){
    linkObject.className = linkObject.className.replace(highlightCssClassRegex,'');
}

function addATagEventAndHighlightLastClicked(request) {
    var links = document.getElementsByTagName("a");
    var urlObj=request.content;
    var currLinkObj;
    for ( var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function() {
            if(curHighlighted!=null)
                deHighlight(curHighlighted);
            sendMsgToBackGround(this);
            // highlight before leaving the page.
            highlight(this);
        }, false);
        currLinkObj = _lj.createUrlObjForAnchorElem(links[i]);
        if (urlObj != null && currLinkObj.equals(urlObj)) {
            highlight(links[i]);
        }
    }
};

