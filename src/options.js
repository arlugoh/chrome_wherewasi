var configDao = new ConfigDao();

function $(id) {
    return document.getElementById(id);
}
function saveWhenToTrigger() {
    if ($("onBackClicked").checked = true) {
        configDao.putWhenToTriggerConfig(ALWAYS_ON);
    } else {
        configDao.putWhenToTriggerConfig(WHEN_TO_TRIGGER_CONFIG_KEY);
    }
};
function init() {
    // init form
    $("onBackClicked").value = ALWAYS_ON;
    $("onActionIconClicked").value = PER_CLICK;
    
    $("onBackClicked").onclick= function(){configDao.putWhenToTriggerConfig(ALWAYS_ON);};
    $("onActionIconClicked").onclick= function(){configDao.putWhenToTriggerConfig(WHEN_TO_TRIGGER_CONFIG_KEY);};
    
    var whenToTrigger = configDao.getWhenToTriggerConfig();
    if (whenToTrigger == ALWAYS_ON) {
        $("onBackClicked").checked = true;
    } else {
        $("onActionIconClicked").checked = true;
    }
};

document.addEventListener('DOMContentLoaded', init);
