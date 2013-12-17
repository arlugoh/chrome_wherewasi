// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
// inheritance section.
function Dao(){};

// added ability to save and retrieve json
Dao.prototype.put=function(key, obj){
    localStorage[key] = JSON.stringify(obj);
}
Dao.prototype.get=function(key){
    var retrievedObject = localStorage[key];
    if(typeof retrievedObject =="undefined"){
        return retrievedObject;
    }
    return JSON.parse(retrievedObject);
}

var ConfigDao = function(){
    Dao.call(this);
}

ConfigDao.prototype=new Dao();
ConfigDao.prototype.constructor=ConfigDao;

ConfigDao.prototype.getWhenToTriggerConfig= function(){
    return this.get(WHEN_TO_TRIGGER_CONFIG_KEY);
}

ConfigDao.prototype.putWhenToTriggerConfig= function(obj){
    return this.put(WHEN_TO_TRIGGER_CONFIG_KEY, obj);
}
