export function saveNextAction ( action, params, path) {
    //encode all args as nextAction
    var paramsStr = "";
    var str = "";
    if (params) {
        paramsStr = JSON.stringify(params);
        str = btoa(action + ',' + paramsStr);
    } else {
        str = btoa(action);
    }
    
    //save to localStorage
    localStorage.setItem("nextAction_"+action, str);
} 

export function loadNextAction (action) {
    //load nextAction from action
    var nextAction = localStorage.getItem("nextAction_"+action);

    //decode nextAction (action name & param)
    if (nextAction !== null) {
        nextAction = atob(nextAction);
        nextAction = nextAction.split(',');
        //clear nextAction
        localStorage.removeItem("nextAction_"+action);
    } else {
        return;
    }
    //return nextAction with action name and param
    return nextAction;
}