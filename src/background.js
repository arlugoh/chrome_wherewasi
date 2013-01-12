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
var PAGE_FULLY_LOADED_ACTION = "init";
// currentAndNextmap/[tabId]/[currentUrl] map to clicked
var currentAndNextmap = new Object();

function onPageFullyLoadedHandler(details) {
    chrome.tabs.sendMessage(details.tabId, {
        command : PAGE_FULLY_LOADED_ACTION,
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

// TODO clean up multiple highlights.-- done
// TODO deal with open on a new tab event -- done, same as above
// TODO bug: when the link is(seemingly the case) javascript function call, 
// the original function call is ignored. This could be caused by the change of the
// dom hierachy, which messes up the class hierachy, which messes javascript event trigger.
// thoughts: don't use <font>, instead, create a class whose name is arbitrary and unique. could use some hash function with some private key.
// then define the class.
 // see http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply

// TODO ability to disable highlights. toggle as browser action.
