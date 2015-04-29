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
var otherThunderrtcid = null;


function disable(domId) {
    console.log("about to try disabling " + domId);
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId) {
    console.log("about to try enabling " + domId);
    document.getElementById(domId).disabled = "";
}


function createLabelledButton(buttonLabel) {
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(buttonLabel));
    document.getElementById("videoSrcBlk").appendChild(button);
    return button;
}


function addMediaStreamToDiv(divId, stream, streamName)
{
    var container = document.createElement("div");
    container.style.marginBottom = "10px";
    var formattedName = streamName.replace("(", "<br>").replace(")", "");
    var labelBlock = document.createElement("div");
    labelBlock.style.width = "220px";
    labelBlock.style.cssFloat = "left";
    labelBlock.innerHTML = "<pre>" + formattedName + "</pre><br>";
    container.appendChild(labelBlock);
    var video = document.createElement("video");
    video.width = 320;
    video.height = 240;
    video.style.verticalAlign = "middle";
    container.appendChild(video);
    document.getElementById(divId).appendChild(container);
    video.autoplay = true;
    video.muted = false;
    thunderrtc.setVideoObjectSrc(video, stream);
    return labelBlock;
}



function createLocalVideo(stream, streamName) {
    var labelBlock = addMediaStreamToDiv("localVideos", stream, streamName);
    var closeButton = createLabelledButton("close");
    closeButton.onclick = function() {
        thunderrtc.closeLocalStream(streamName);
        labelBlock.parentNode.parentNode.removeChild(labelBlock.parentNode);
    }
    labelBlock.appendChild(closeButton);
}

function addSrcButton(buttonLabel, videoId) {
    var button = createLabelledButton(buttonLabel);
    button.onclick = function() {
        thunderrtc.setVideoSource(videoId);
        thunderrtc.initMediaSource(
                function(stream) {
                    createLocalVideo(stream, buttonLabel);
                    if (otherThunderrtcid) {
                        thunderrtc.addStreamToCall(otherThunderrtcid, buttonLabel);
                    }
                },
                function(errCode, errText) {
                    thunderrtc.showError(errCode, errText);
                }, buttonLabel);
    };
}

function connect() {
    console.log("Initializing.");
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.connect("thunderrtc.multistream", loginSuccess, loginFailure);
    thunderrtc.setAutoInitUserMedia(false);

    thunderrtc.getVideoSourceList(function(videoSrcList) {
        for (var i = 0; i < videoSrcList.length; i++) {
            var videoEle = videoSrcList[i];
            var videoLabel = (videoSrcList[i].label && videoSrcList[i].label.length > 0) ?
                    (videoSrcList[i].label) : ("src_" + i);
            addSrcButton(videoLabel, videoSrcList[i].id);
        }
    });
    //
    // add an extra button for screen sharing
    //
    var screenShareButton = createLabelledButton("Desktop capture/share");
    var numScreens = 0;

    screenShareButton.onclick = function() {
        numScreens++;
        var streamName = "screen" + numScreens;
        thunderrtc.initDesktopStream(
                function(stream) {
                    createLocalVideo(stream, streamName);
                    if (otherThunderrtcid) {
                        thunderrtc.addStreamToCall(otherThunderrtcid, streamName);
                    }
                },
                function(errCode, errText) {
                    thunderrtc.showError(errCode, errText);
                },
                streamName);
    };

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


function convertListToButtons(roomName, occupants, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for (var thunderrtcid in occupants) {
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


function performCall(targetThunderrtcId) {
    var acceptedCB = function(accepted, thunderrtcid) {
        if (!accepted) {
            thunderrtc.showError("CALL-REJECTED", "Sorry, your call to " + thunderrtc.idToName(thunderrtcid) + " was rejected");
            enable('otherClients');
        }
        else {
            otherThunderrtcid = targetThunderrtcId;
        }
    };

    var successCB = function() {
        enable('hangupButton');
    };
    var failureCB = function() {
        enable('otherClients');
    };
    var keys = thunderrtc.getLocalMediaIds();

    thunderrtc.call(targetThunderrtcId, successCB, failureCB, acceptedCB, keys);
    enable('hangupButton');
}


function loginSuccess(thunderrtcid) {
    disable("connectButton");
    //  enable("disconnectButton");
    enable('otherClients');
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtc.cleanId(thunderrtcid);
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}


function disconnect() {
    document.getElementById("iam").innerHTML = "logged out";
    thunderrtc.disconnect();
    enable("connectButton");
//    disable("disconnectButton");
    clearConnectList();
    thunderrtc.setVideoObjectSrc(document.getElementById('selfVideo'), "");
}

thunderrtc.setStreamAcceptor(function(thunderrtcid, stream, streamName) {
    var labelBlock = addMediaStreamToDiv("remoteVideos", stream, streamName);
    labelBlock.parentNode.id = "remoteBlock" + thunderrtcid + streamName;

    console.log("accepted incoming stream with name " + stream.streamName);
    console.log("checking incoming " + thunderrtc.getNameOfRemoteStream(thunderrtcid, stream));

});



thunderrtc.setOnStreamClosed(function(thunderrtcid, stream, streamName) {
    var item = document.getElementById("remoteBlock" + thunderrtcid + streamName);
    item.parentNode.removeChild(item);
});


var callerPending = null;

thunderrtc.setCallCancelled(function(thunderrtcid) {
    if (thunderrtcid === callerPending) {
        document.getElementById('acceptCallBox').style.display = "none";
        callerPending = false;
    }
});

thunderrtc.setAcceptChecker(function(thunderrtcid, callback) {
    otherThunderrtcid = thunderrtcid;
    if (thunderrtc.getConnectionCount() > 0) {
        thunderrtc.hangupAll();
    }
    callback(true, thunderrtc.getLocalMediaIds());
});

var mypluginId = "tawk-desktop-capture/bemabaogbdfpbkkganibcmhbgjogabfj";

setTimeout(
     function() {
         document.getElementById("pluginstatus").innerHTML = thunderrtc.isDesktopCaptureInstalled()
             ?"Desktop capture ready"
             :"Desktop capture not installed";
     }, 3000);

document.getElementById("installPluginButton").onclick = function() {
chrome.webstore.install();
};