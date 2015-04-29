var selfThunderrtcid = "";


function connect() {

    var localFilter = thunderrtc.buildLocalSdpFilter( {
        audioRecvBitrate:20, videoRecvBitrate:30
    });
    var remoteFilter = thunderrtc.buildRemoteSdpFilter({
        audioSendBitrate: 20, videoSendBitrate:30
    });
    thunderrtc.setSdpFilters(localFilter, remoteFilter);
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.easyApp("thunderrtc.lowbandwidth", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
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

    var successCB = function() {};
    var failureCB = function() {};
    thunderrtc.call(otherThunderrtcid, successCB, failureCB);
}


function loginSuccess(thunderrtcid) {
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtc.cleanId(thunderrtcid);
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}
