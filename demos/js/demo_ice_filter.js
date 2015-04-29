var selfThunderrtcid = "";


function connect() {
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.easyApp("thunderrtc.iceFilter", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
 }


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


function convertListToButtons (roomName, data, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for(var thunderrtcid in data) {
        var button = document.createElement('button');
        button.onclick = function(thunderrtcid) {
            return function() {
                performCall(thunderrtcid);
            };
        }(thunderrtcid);

        var label = document.createTextNode(thunderrtc.idToName(thunderrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


function performCall(otherThunderrtcid) {
    thunderrtc.hangupAll();
    thunderrtc.setIceUsedInCalls( getModifiedIceList());
    var successCB = function() {};
    var failureCB = function() {};
    thunderrtc.call(otherThunderrtcid, successCB, failureCB);
}





var iceMap = [];

function getModifiedIceList(){
   var iceList = [];
   var i;

   for( i = 0; i < iceMap.length; i++ ) {
      if( document.getElementById("iscb" + i).checked ) {
         iceList.push( iceMap[i]);
      }
   }
   return {iceServers: iceList};
}


function loginSuccess(thunderrtcid) {
    var i;

    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtc.cleanId(thunderrtcid);
    var blockentries = "<h3>Ice Entries</h3>";
    var iceServers = thunderrtc.getServerIce();
    for(i = 0; i < iceServers.iceServers.length; i++ ) {
	    iceMap[i] = iceServers.iceServers[i];
        var label = "iscb" + i;
	    blockentries += '<div style="width:100%;overflow:hidden;text-align:left"><input type="checkbox" id="' + label + '" + checked="checked" style="float:left>' +
                    '<label for="' + label + '" style="float:left">' +  iceServers.iceServers[i].url + '></div>';

    }
    document.getElementById("iceEntries").innerHTML = blockentries;

}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}
