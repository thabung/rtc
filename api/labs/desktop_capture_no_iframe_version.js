//
// This code was taken from: https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Pluginfree-Screen-Sharing
// and modified to fit with ThunderRTC.
//

// todo: need to check exact chrome browser because opera/node-webkit also uses chromium framework
var isChrome = !!navigator.webkitGetUserMedia;

// DetectRTC.js - github.com/muaz-khan/WebRTC-Experiment/tree/master/DetectRTC
// Below code is taken from RTCMultiConnection-v1.8.js (http://www.rtcmulticonnection.org/changes-log/#v1.8)
// and modified.
var DetectRTC = {};

(function() {
    var screenCallback;

    DetectRTC.screen = {
        supported: false,
        getSourceId: function(callback) {
            if (!callback)
                throw '"callback" parameter is mandatory.';
            screenCallback = callback;
            window.postMessage('desktopcapture-get-sourceId', '*');
        },
        isChromeExtensionAvailable: function(callback) {
            if (!callback) {
                return;
            }

            if (DetectRTC.screen.supported) {
                callback(true);
            }

            // ask extension if it is available
            window.postMessage('desktopcapture-are-you-there', '*');

            setTimeout(function() {
                callback(DetectRTC.screen.supported);
            }, 2000);
        },
        onMessageCallback: function(data) {
            // "cancel" button is clicked
            if (data == 'PermissionDeniedError') {
                DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                if (screenCallback) {
                   return screenCallback('PermissionDeniedError');
                }
                else {
                    throw new Error('PermissionDeniedError');
                }
            }

            // extension notified his presence
            if (data == 'desktopcapture-loaded') {
                DetectRTC.screen.supported = true;
            }

            // extension shared temp sourceId
            if (data.sourceId) {
                DetectRTC.screen.sourceId = data.sourceId;
                if (screenCallback) {
                    screenCallback(null);
                }
            }
        }
    };

    // check if desktop-capture extension installed.
    if (window.postMessage && isChrome) {
        DetectRTC.screen.isChromeExtensionAvailable(function(){});
    }
})();

window.addEventListener('message', function(event) {
    if (event.origin != window.location.origin) {
        return;
    }

    DetectRTC.screen.onMessageCallback(event.data);
});

thunderrtc.isDesktopCaptureInstalled = function() {
    return DetectRTC.screen.supported;
}

thunderrtc.initDesktopStream = function(successCallback, failureCallback, streamName) {
    if (!thunderrtc.isDesktopCaptureInstalled()) {
        failureCallback(thunderrtc.errCodes.DEVELOPER_ERR, "Desktop capture plugin not installed").
                return;
    }

    DetectRTC.screen.getSourceId(function(error) {
        if( error) {
            failureCallback(thunderrtc.errCodes.MEDIA_ERR, error);
        }
        else if (DetectRTC.screen.sourceId) {
            thunderrtc._presetMediaConstraints = {
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: DetectRTC.screen.sourceId,
                        maxWidth: 1920,
                        maxHeight: 1080,
                        minAspectRatio: 1.77
                    }
                },
                audio: false
            }
            thunderrtc.initMediaSource(successCallback, failureCallback, streamName);
        }
        else {
            failureCallback(thunderrtc.errCodes.MEDIA_CANCELLED, "Desktop capture plugin not installed");
        }
    });
}

/**
 * This method builds a function that can be attached to a button to install an extension.
 * The install will only work on a {@link https://support.google.com/webmasters/answer/34592?hl=en|Google Verified Website}
 * with a `link` tag pointing to the extension, which is required by chrome for
 * {@link https://developer.chrome.com/webstore/inline_installation|Inline Installations}.
 *
 * @example
 *
 * <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/bemabaogbdfpbkkganibcmhbgjogabfj" id="custom-app-id" />
 *
 * thunderrtc.chromeInstall("custom-app_id", function() {
 *         // success
 *     },
 *     function(errorCode, errorText) {
 *         // failure
 *     });
 *
 * @param  {String} extensionId The id of the `link` tag pointing to your extension.
 * @param  {Function} successCallback Function to call on success.
 * @param  {Function} failureCallback Function to call on failure.  Will pass argument `errorCode` and `errorMessage`.
 */
thunderrtc.chromeInstaller = function(extensionId, successCallback, failureCallback) {
    return function() {
        var el, url;
        if( !navigator.webkitGetUserMedia ||
            !window.chrome ||
            !chrome.webstore ||
            !chrome.webstore.install ) {
            failureCallback(thunderrtc.errCodes.DEVELOPER_ERR, "Can't install plugin on non-chrome browsers");
        }
        else {
            try {
                var el = document.querySelector('head link#' + extensionId);

                if ( ! el) throw new Error("Can't find a `link` element in `head` with id `"+extensionId+"`");

                // get the chrome extension url from the link's href attribute
                var url = el.attributes.href.value;

                chrome.webstore.install(url, successCallback, function(error) {
                    failureCallback(thunderrtc.errCodes.DEVELOPER_ERR, error);
                });

            }
            catch (error) {
                failureCallback(thunderrtc.errCodes.DEVELOPER_ERR, error.message);
            }
        }
    }
}
