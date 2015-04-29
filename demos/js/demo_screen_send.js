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

function initApp() {
    if( window.localStorage && window.localStorage.thunderrtcUserName ) {
        document.getElementById('userName').value = window.localStorage.thunderrtcUserName;
    }
}


function disable(domId) {
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
    document.getElementById(domId).disabled = "";
}

var contactedListeners = {};
var nameToIdMap = {};

function connect() {
    thunderrtc.enableDebug(false);
    var tempName = document.getElementById('userName').value;
    if(  !thunderrtc.isNameValid(tempName)) {
        thunderrtc.showError("BAD-USER-NAME", "illegal user name");
        return;
    }
    thunderrtc.setUsername(tempName);
    if( window.localStorage && window.localStorage.thunderrtcUserName ) {
        window.localStorage.thunderrtcUserName = tempName;
    }
    console.log("Initializing with username " + tempName);
    thunderrtc.setScreenCapture();
    thunderrtc.enableAudio(document.getElementById("shareAudio").checked);
    thunderrtc.setRoomOccupantListener(function (roomName, otherPeers){
        var thunderrtcid;
        for(thunderrtcid in otherPeers ) {
            if( !contactedListeners[thunderrtcid]) {
                thunderrtc.sendPeerMessage(thunderrtcid, "available", {
                    sender:true
                }, function(){}, function(errCode, errorText) {
                    console.log("messaging error" + errorText);
                });
            }
        }
        contactedListeners = otherPeers;
    });

    thunderrtc.setPeerListener(function(thunderrtcid, msgType, data){});

    thunderrtc.connect("thunderrtc.videoScreen", loginSuccess, loginFailure);
}


function hangup() {
    thunderrtc.hangupAll();
    disable('hangupButton');
}


function loginSuccess(thunderrtcid) {
    disable("connectButton");
    disable("shareAudio");
    enable("disconnectButton");
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "Connected";
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    thunderrtc.disconnect();
    enable("shareAudio");
    console.log("disconnecting from server");
    enable("connectButton");
    disable("disconnectButton");
    thunderrtc.setVideoObjectSrc(document.getElementById('callerAudio'), "");
}


thunderrtc.setStreamAcceptor( function(thunderrtcid, stream) {
    var audio = document.getElementById('callerAudio');
    thunderrtc.setVideoObjectSrc(audio,stream);
    console.log("got audio from " + thunderrtc.idToName(thunderrtcid));
    enable("hangupButton");
});



thunderrtc.setOnStreamClosed( function (thunderrtcid) {
    thunderrtc.setVideoObjectSrc(document.getElementById('callerAudio'), "");
    disable("hangupButton");
});


var callerPending = null;

thunderrtc.setCallCancelled( function(thunderrtcid){
    if( thunderrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});


thunderrtc.setAcceptChecker(function(thunderrtcid, cb) {
    document.getElementById('acceptCallBox').style.display = "block";
    callerPending = thunderrtcid;

   document.getElementById('acceptCallLabel').innerHTML = "Accept incoming call from " + thunderrtc.idToName(thunderrtcid) + " ?";

    var acceptTheCall = function(wasAccepted) {
        document.getElementById('acceptCallBox').style.display = "none";
        cb(wasAccepted);
        callerPending = null;
    };
    document.getElementById("callAcceptButton").onclick = function() {
        console.log("accepted the call");
        acceptTheCall(true);
    };
    document.getElementById("callRejectButton").onclick =function() {
        console.log("rejected the call");
        acceptTheCall(false);
    };
} );