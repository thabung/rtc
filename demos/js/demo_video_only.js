//
//Copyright (c) 2014, CosRTC Software Inc.
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
//LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//POSSIBILITY OF SUCH DAMAGE.
//
var selfThunderrtcid = "";

function disable(domId) {
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
    document.getElementById(domId).disabled = "";
}


function connect() {
    thunderrtc.enableDebug(false);
    console.log("Initializing.");
    thunderrtc.enableAudio(false);
    thunderrtc.enableAudioReceive(false);
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.initMediaSource(
        function(){        // success callback
            var selfVideo = document.getElementById("selfVideo");
            thunderrtc.setVideoObjectSrc(selfVideo, thunderrtc.getLocalStream());
            thunderrtc.connect("thunderrtc.videoOnly", loginSuccess, loginFailure);
        },
        function(errorCode, errmesg){
            thunderrtc.showError("MEDIA-ERROR", errmesg);
        }  // failure callback
        );
}


function terminatePage() {
    thunderrtc.disconnect();
}


function hangup() {
    thunderrtc.hangupAll();
    disable('hangupButton');
}


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

}


function convertListToButtons (roomName, occupants, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for(var thunderrtcid in occupants) {
        var button = document.createElement('button');
        button.onclick = function(thunderrtcid) {
            return function() {
                performCall(thunderrtcid);
            };
        }(thunderrtcid);

        var label = document.createTextNode( thunderrtc.idToName(thunderrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
    if( !otherClientDiv.hasChildNodes() ) {
        otherClientDiv.innerHTML = "<em>Nobody else is on...</em>";
    }
}


function performCall(otherThunderrtcid) {
    thunderrtc.hangupAll();
    var acceptedCB = function(accepted, thunderrtcid) {
        if( !accepted ) {
            thunderrtc.showError("CALL-REJECTED", "Sorry, your call to " + thunderrtc.idToName(thunderrtcid) + " was rejected");
            enable('otherClients');
        }
    };
    var successCB = function() {
        enable('hangupButton');
    };
    var failureCB = function() {
        enable('otherClients');
    };
    thunderrtc.call(otherThunderrtcid, successCB, failureCB, acceptedCB);
}


function loginSuccess(thunderrtcid) {
    disable("connectButton");
    // enable("disconnectButton");
    enable('otherClients');
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtcid;
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    thunderrtc.disconnect();
    console.log("disconnecting from server");
    enable("connectButton");
    // disable("disconnectButton");
    clearConnectList();
    thunderrtc.setVideoObjectSrc(document.getElementById('selfVideo'), "");
}


thunderrtc.setStreamAcceptor( function(thunderrtcid, stream) {
    var video = document.getElementById('callerVideo');
    thunderrtc.setVideoObjectSrc(video,stream);
    console.log("saw video from " + thunderrtcid);
    enable("hangupButton");
});


thunderrtc.setOnStreamClosed( function (thunderrtcid) {
    thunderrtc.setVideoObjectSrc(document.getElementById('callerVideo'), "");
    disable("hangupButton");
});


thunderrtc.setAcceptChecker(function(thunderrtcid, callback) {
    document.getElementById('acceptCallBox').style.display = "block";
    if( thunderrtc.getConnectionCount() > 0 ) {
        document.getElementById('acceptCallLabel').innerHTML = "Drop current call and accept new from " + thunderrtc.idToName(thunderrtcid) + " ?";
    }
    else {
        document.getElementById('acceptCallLabel').innerHTML = "Accept incoming call from " + thunderrtc.idToName(thunderrtcid) +  " ?";
    }
    var acceptTheCall = function(wasAccepted) {
        document.getElementById('acceptCallBox').style.display = "none";
        if( wasAccepted && thunderrtc.getConnectionCount() > 0 ) {
            thunderrtc.hangupAll();
        }
        callback(wasAccepted);
    };
    document.getElementById("callAcceptButton").onclick = function() {
        acceptTheCall(true);
    };
    document.getElementById("callRejectButton").onclick =function() {
        acceptTheCall(false);
    };
} );
