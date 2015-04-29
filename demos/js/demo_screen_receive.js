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


function connect() {
    console.log("Initializing.");

    var userName = document.getElementById('userName').value;
    if( !thunderrtc.isNameValid(userName)) {
        thunderrtc.showError("BAD-USER-NAME", "illegal user name");
        return;
    }

    thunderrtc.setUsername(userName);
    if( window.localStorage ) {
        window.localStorage.thunderrtcUserName = document.getElementById('userName').value;
    }


    thunderrtc.enableAudio(document.getElementById('shareAudio').checked);
    thunderrtc.enableVideo(false);
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.connect("thunderrtc.videoScreen", loginSuccess, loginFailure);

}


function hangup() {
    thunderrtc.hangupAll();
    disable('hangupButton');
}



//
// this method actually just removes old buttons.
// The adding of buttons is done with the data listener.
//
function convertListToButtons(roomName, data, isPrimary){
    console.log("saw data list of " + JSON.stringify(data));
    var otherClientDiv = document.getElementById('otherClients');
    var i, nextChild;

    for( i = otherClientDiv.childNodes[0]; i; i = nextChild ){
        nextChild = i.nextSibling;
        var buttonId = i.id;
        if( !data[buttonId]){
            console.log("  removing button with id " + buttonId);
            otherClientDiv.removeChild(i);
        }
    }
}





function requestFullScreen() {
    var elem = document.getElementById('videos');
    elem.className = 'bigBox';
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
    var hideBox = document.getElementById('shrinkBox');
    hideBox.className = 'yesShrink';
    hideBox.onclick = function() {
        hideBox.className = 'noShrink';
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        elem.className = 'smallBox';
    };

}


thunderrtc.setPeerListener(function(thunderrtcid, msgType, data){
    var otherClientDiv = document.getElementById('otherClients');
    var button = document.createElement('button');
    button.onclick = function(thunderrtcid) {
        return function() {
            performCall(thunderrtcid);
        };
    }(thunderrtcid);
    button.id = "callbutton_" +thunderrtcid;
    console.log("adding button for id =" + thunderrtcid);
    var label = document.createTextNode("Get screen of " + thunderrtc.idToName(thunderrtcid));
    button.appendChild(label);
    otherClientDiv.appendChild(button);
});


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
    enable('hangupButton');
}


function loginSuccess(thunderrtcid) {
    disable("connectButton");
    enable("disconnectButton");
    enable('otherClients');
    document.getElementById("iam").innerHTML = "Connected";
    selfThunderrtcid = thunderrtcid;
}


function loginFailure(errorCode, message) {
    thunderrtc.showError("LOGIN-FAILURE", "failure to login");
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    thunderrtc.disconnect();
    console.log("disconnecting from server");
    enable("connectButton");
    disable("disconnectButton");
}


thunderrtc.setStreamAcceptor( function(caller, stream) {
    var video = document.getElementById('callerVideo');
    thunderrtc.setVideoObjectSrc(video,stream);
    console.log("saw video from " + caller);
    enable("hangupButton");
});



thunderrtc.setOnStreamClosed( function (thunderrtcid) {
    thunderrtc.setVideoObjectSrc(document.getElementById('callerVideo'), "");
    document.cancelFullScreen();
    disable("hangupButton");
});


var callerPending = null;

thunderrtc.setCallCancelled( function(thunderrtcid){
    if( thunderrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});
