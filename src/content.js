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

var HASH_COMMAND = "hash";
var ADD_LISTENER_TO_A_TAGS = "processATags";

var highlightStartTag = "<font style='color:white; background-color:green;'>";
var highlightEndTag = "</font>";

var curHighlighted;

function sendMsgToBackGround(clicked){
    chrome.extension.sendMessage({
        clicked : clicked,
        currentUrl : document.URL,
        command: HASH_COMMAND
        });
}

function highlight(linkObject){
    // When user open new tab, we just need to highlight the clicked link
    linkObject["innerHTML"]=highlightStartTag + linkObject["innerHTML"] + highlightEndTag;
}
function deHighlight(linkObject){
    linkObject["innerHTML"]=linkObject.firstChild["innerHTML"];
}

function addATagEventAndHighlightLastClicked(request) {
    if(request.command != ADD_LISTENER_TO_A_TAGS){
        return;
    }
    var links = document.getElementsByTagName("a");
    for ( var i = 0; i < links.length; i++) {
//        var link = links[i];
        // console.log("found "+link.href);
        links[i].addEventListener("click", function() {
            if(curHighlighted!=null)
                deHighlight(curHighlighted);
            curHighlighted = this;
            sendMsgToBackGround(this.href);
            // It could happen that the new link is opened as a new tab. so highlight it before leaving anyway.
            highlight(this);
        }, false);
        if (request.lastClicked != null && links[i]["href"] == request.lastClicked) {
            highlight(links[i]);
            curHighlighted = links[i];
        }
    }
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        addATagEventAndHighlightLastClicked(request);
});
