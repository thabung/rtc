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
var haveSelfVideo = false;

function disable(domId) {
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
    document.getElementById(domId).disabled = "";
}


function connect() {	
  thunderrtc.enableAudio(document.getElementById("shareAudio").checked);
  thunderrtc.enableVideo(document.getElementById("shareVideo").checked);
  thunderrtc.enableDataChannels(true);
  thunderrtc.setRoomOccupantListener( convertListToButtons);    
  thunderrtc.initMediaSource(
		  function(){        // success callback
			  var selfVideo = document.getElementById("selfVideo");			
			  thunderrtc.setVideoObjectSrc(selfVideo, thunderrtc.getLocalStream());			 
			  thunderrtc.connect("thunderrtc.audioVideo", loginSuccess, loginFailure);			  
		  },
		  loginFailure
	);
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

        var label = document.createTextNode("Call " + thunderrtc.idToName(thunderrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}


function setUpMirror() {
    if( !haveSelfVideo) {
        var selfVideo = document.getElementById("selfVideo");
        thunderrtc.setVideoObjectSrc(selfVideo, thunderrtc.getLocalStream());
        selfVideo.muted = true;
        haveSelfVideo = true;
    }
}

function performCall(otherThunderrtcid) {
    thunderrtc.hangupAll();
    var acceptedCB = function(accepted, thunderrtcid) {
        if( !accepted ) {
            thunderrtc.showError("CALL-REJECTEd", "Sorry, your call to " + thunderrtc.idToName(thunderrtcid) + " was rejected");
            enable('otherClients');
        }
    };

    var successCB = function() {
        setUpMirror();
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
  //  enable("disconnectButton");
    enable('otherClients');
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtc.cleanId(thunderrtcid);
    thunderrtc.showError("noerror", "logged in");
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}


function disconnect() {
  thunderrtc.disconnect();			  
  document.getElementById("iam").innerHTML = "logged out";
  enable("connectButton");
  disable("disconnectButton"); 
  thunderrtc.clearMediaStream( document.getElementById('selfVideo'));
  thunderrtc.setVideoObjectSrc(document.getElementById("selfVideo"),"");
  thunderrtc.closeLocalMediaStream();
  thunderrtc.setRoomOccupantListener( function(){});  
  clearConnectList();
} 


thunderrtc.setStreamAcceptor( function(thunderrtcid, stream) {
    setUpMirror();
    var video = document.getElementById('callerVideo');
    thunderrtc.setVideoObjectSrc(video,stream);
    enable("hangupButton");
});



thunderrtc.setOnStreamClosed( function (thunderrtcid) {
    thunderrtc.setVideoObjectSrc(document.getElementById('callerVideo'), "");
    disable("hangupButton");
});


var callerPending = null;

thunderrtc.setCallCancelled( function(thunderrtcid){
    if( thunderrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});


thunderrtc.setAcceptChecker(function(thunderrtcid, callback) {
    document.getElementById('acceptCallBox').style.display = "block";
    callerPending = thunderrtcid;
    if( thunderrtc.getConnectionCount() > 0 ) {
        document.getElementById('acceptCallLabel').innerHTML = "Drop current call and accept new from " + thunderrtc.idToName(thunderrtcid) + " ?";
    }
    else {
        document.getElementById('acceptCallLabel').innerHTML = "Accept incoming call from " + thunderrtc.idToName(thunderrtcid) + " ?";
    }
    var acceptTheCall = function(wasAccepted) {
        document.getElementById('acceptCallBox').style.display = "none";
        if( wasAccepted && thunderrtc.getConnectionCount() > 0 ) {
            thunderrtc.hangupAll();
        }
        callback(wasAccepted);
        callerPending = null;
    };
    document.getElementById("callAcceptButton").onclick = function() {
        acceptTheCall(true);
    };
    document.getElementById("callRejectButton").onclick =function() {
        acceptTheCall(false);
    };
} );