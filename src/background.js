/**
 *  WhereWasI , a Chrome extension.
 *  
 * 
 * @author jlu aka "LJ"
 */

// currentAndNextmap/[tabId]/[currentUrl] map to clicked
var currentAndNextmap = new Object();
var configDao = new ConfigDao();

(function initExtension(){
    if(!validateLocalStorage()){
        // default settings 
        configDao.putWhenToTriggerConfig(PER_CLICK);
    }
})();

function validateLocalStorage(){
    var obj = configDao.getWhenToTriggerConfig();
    try{
        if(typeof obj == "undefined")
            return false;
        else
            return true;
    }
    catch(e){return false;}
}

function onPageFullyLoadedHandler(details) {
    urlObj = currentAndNextmap.hasOwnProperty(details.tabId) && 
    currentAndNextmap[details.tabId].hasOwnProperty(details.url)?
            currentAndNextmap[details.tabId][details.url]:null;
    content=new Object();
    content.urlObj=urlObj;
    content[WHEN_TO_TRIGGER_CONFIG_KEY]=configDao.getWhenToTriggerConfig();
    msg=new MessageSpec( PAGE_LOADED_SIGNAL , content);
    chrome.tabs.sendMessage(details.tabId, msg, function(response) {// do nothing
    });
}

chrome.webNavigation.onCompleted.addListener(onPageFullyLoadedHandler);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.whatsup == LINK_CLICKED_SIGNAL) {
        var tabId = sender.tab.id;
        if(typeof currentAndNextmap[tabId]=="undefined"){
            currentAndNextmap[tabId] = new Object();
        }
        currentAndNextmap[tabId][request.content.currUrl] = request.content.clickedUrlObj;
    }
});

// when tab closed, remove all data associated with it.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    delete currentAndNextmap[tabId];
});

chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, new MessageSpec(FLASH_THE_LINK), function(response){
    });
});

