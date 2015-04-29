ThunderRTC: Using Alongside Other Servers
======================================

ThunderRTC supports working alongside of Apache, IIS, and other web servers. In these cases, your web application would use ThunderRTC to just handle signaling. All html and other files would continue to be hosted on the current web server. 


Configuration Notes:
--------------------
 - ThunderRTC can be set to use a different port to avoid conflicts (such as 8080)
 - In client code, you must tell ThunderRTC the socket.io URL prior to running `thunderrtc.easyApp()` or `thunderrtc.connect()`
   - `thunderrtc.setSocketUrl("<URL>");`
     - eg: `thunderrtc.setSocketUrl("//mydomain.com:8080");`
   - If the ThunderRTC server is simply on a different port you can use:
     - `thunderrtc.setSocketUrl(":<PORT>");`
     - eg: `thunderrtc.setSocketUrl(":8080");`
 - If your web server is running SSL, then ThunderRTC should too
 - Ensure that all client API files resolve properly from your HTML. If API's remain hosted on the ThunderRTC server your HTML may need to explicitly link to them. Commonly linked to API files are:
   - /thunderrtc/thunderrtc.js
   - /thunderrtc/thunderrtc.css
   - /thunderrtc/thunderrtc_ft.js (optional file transfer api)
   - /socket.io/socket.io.js
 - Optional: Host API directories on the web server so all JavaScript calls are from the same server. The folders containing client side API's are: 
   -  `/node_modules/thunderrtc/api/`
   -  `/node_modules/socket.io/node_modules/socket.io-client/dist/`


Walkthrough for Simple Audio Video Demo
---------------------------------------

Here are some steps to running the simple audio video demo from your web server. This is assuming you are running locally with your web server on port 80, and ThunderRTC on port 8080.

 1. Copy the ThunderRTC /demos folder to your web root (or a sub folder) 
 2. Edit `demo_audio_video_simple.html`
    - Replace all instances of `/thunderrtc/` with `//localhost:8080/thunderrtc/`
 3. Edit `js/demo_audio_video_simple.js`
    - Insert the following to be the first line within the connect() function:
      `thunderrtc.setSocketUrl(":8080");`
 4. Start your webserver and ThunderRTC server
 5. In your browser visit:
    http://localhost/demos/demo_audio_video_simple.html
 
Your own WebRTC app can then be developed in a similar fashion.


If You Run Into Problems
------------------------
Please feel free to post on our discussion forum:

 - [https://groups.google.com/forum/#!forum/thunderrtc](https://groups.google.com/forum/#!forum/thunderrtc)
