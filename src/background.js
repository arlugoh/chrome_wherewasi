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
// currentAndNextmap/[tabId]/[currentUrl] map to clicked
var currentAndNextmap = new Object();

function onPageFullyLoadedHandler(details) {
    chrome.tabs.sendMessage(details.tabId, {
        command : ADD_LISTENER_TO_A_TAGS,
        lastClicked : currentAndNextmap.hasOwnProperty(details.tabId) && 
                      currentAndNextmap[details.tabId].hasOwnProperty(details.url)?
                      currentAndNextmap[details.tabId][details.url]:null
    }, function(response) {// do nothing
    });
}

chrome.webNavigation.onCompleted.addListener(onPageFullyLoadedHandler);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command == HASH_COMMAND) {
        var tabId = sender.tab.id;
        if(typeof currentAndNextmap[tabId]=="undefined"){
            currentAndNextmap[tabId] = new Object();
        }
        currentAndNextmap[tabId][request.currentUrl] = request.clicked;
    }
});

// when tab closed, remove all data associated with it.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    delete currentAndNextmap[tabId];
});

// TODO clean up multiple highlights.

// TODO deal with open on a new tab event 
// TODO ability to disable highlights. toggle as browser action.
