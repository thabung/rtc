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
    console.log("Initializing.");
    thunderrtc.enableVideo(false);
    thunderrtc.enableAudio(false);
    connect();
}

function connect() {
    thunderrtc.connect("thunderrtc.reconnect", loginSuccess, loginFailure);
}

function disconnect() {
    thunderrtc.disconnect();
}

thunderrtc.enableDebug(true);

thunderrtc.setDisconnectListener(function() {
   thunderrtc.showError("xx", "saw disconnect");
});


function sendDummy() {
    thunderrtc.getRoomList( 
      function() { 
         thunderrtc.showError("xx", "got fresh roomlist");
      }, 
      function(){ 
         thunderrtc.showError("xx", "failed on fresh roomlist");
      });
}

function loginSuccess(thunderrtcid) {
    document.getElementById("stateLabel").innerHTML = " connected as " + thunderrtcid;
    thunderrtc.showError("xx", "login success");
}


function loginFailure(errorCode, message) {
    document.getElementById("stateLabel").innerHTML = "disconnected";
    thunderrtc.showError("xx", "login failure");
}


