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
var connectList = {};
var channelIsActive = {}; // tracks which channels are active


function connect() {
    thunderrtc.enableDebug(false);
    thunderrtc.enableDataChannels(true);
    thunderrtc.enableVideo(false);
    thunderrtc.enableAudio(false);
    thunderrtc.enableVideoReceive(false);
    thunderrtc.enableAudioReceive(false);
    thunderrtc.setDataChannelOpenListener(openListener);
    thunderrtc.setDataChannelCloseListener(closeListener);
    thunderrtc.setPeerListener(addToConversation);
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.connect("thunderrtc.dataMessaging", loginSuccess, loginFailure);
}


function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    content = content.replace(/\n/g, '<br />');
    document.getElementById('conversation').innerHTML +=
            "<b>" + who + ":</b>&nbsp;" + content + "<br />";
}


function openListener(otherParty) {
    channelIsActive[otherParty] = true;
    updateButtonState(otherParty);
}


function closeListener(otherParty) {
    channelIsActive[otherParty] = false;
    updateButtonState(otherParty);
}

function convertListToButtons(roomName, occupantList, isPrimary) {
    connectList = occupantList;

    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

    var label, button;
    for (var thunderrtcid in connectList) {
        var rowGroup = document.createElement("span");
        var rowLabel = document.createTextNode(thunderrtc.idToName(thunderrtcid));
        rowGroup.appendChild(rowLabel);

        button = document.createElement('button');
        button.id = "connect_" + thunderrtcid;
        button.onclick = function(thunderrtcid) {
            return function() {
                startCall(thunderrtcid);
            };
        }(thunderrtcid);
        label = document.createTextNode("Connect");
        button.appendChild(label);
        rowGroup.appendChild(button);

        button = document.createElement('button');
        button.id = "send_" + thunderrtcid;
        button.onclick = function(thunderrtcid) {
            return function() {
                sendStuffP2P(thunderrtcid);
            };
        }(thunderrtcid);
        label = document.createTextNode("Send Message");
        button.appendChild(label);
        rowGroup.appendChild(button);
        otherClientDiv.appendChild(rowGroup);
        updateButtonState(thunderrtcid);
    }
    if (!otherClientDiv.hasChildNodes()) {
        otherClientDiv.innerHTML = "<em>Nobody else logged in to talk to...</em>";
    }
}

function updateButtonState(otherThunderrtcid) {
    var isConnected = channelIsActive[otherThunderrtcid];
    if(document.getElementById('connect_' + otherThunderrtcid)) {
        document.getElementById('connect_' + otherThunderrtcid).disabled = isConnected;
    }
    if( document.getElementById('send_' + otherThunderrtcid)) {
        document.getElementById('send_' + otherThunderrtcid).disabled = !isConnected;
    }
}


function startCall(otherThunderrtcid) {
    if (thunderrtc.getConnectStatus(otherThunderrtcid) === thunderrtc.NOT_CONNECTED) {
        try {
        thunderrtc.call(otherThunderrtcid,
                function(caller, media) { // success callback
                    if (media === 'datachannel') {
                        // console.log("made call succesfully");
                        connectList[otherThunderrtcid] = true;
                    }
                },
                function(errorCode, errorText) {
                    connectList[otherThunderrtcid] = false;
                    thunderrtc.showError(errorCode, errorText);
                },
                function(wasAccepted) {
                    // console.log("was accepted=" + wasAccepted);
                }
        );
        }catch( callerror) {
            console.log("saw call error ", callerror);
        }
    }
    else {
        thunderrtc.showError("ALREADY-CONNECTED", "already connected to " + thunderrtc.idToName(otherThunderrtcid));
    }
}

function sendStuffP2P(otherThunderrtcid) {
    var text = document.getElementById('sendMessageText').value;
    if (text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }
    if (thunderrtc.getConnectStatus(otherThunderrtcid) === thunderrtc.IS_CONNECTED) {
        thunderrtc.sendDataP2P(otherThunderrtcid, 'msg', text);
    }
    else {
        thunderrtc.showError("NOT-CONNECTED", "not connected to " + thunderrtc.idToName(otherThunderrtcid) + " yet.");
    }

    addToConversation("Me", "msgtype", text);
    document.getElementById('sendMessageText').value = "";
}


function loginSuccess(thunderrtcid) {
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtcid;
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, "failure to login");
}
