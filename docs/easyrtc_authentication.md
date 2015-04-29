ThunderRTC: Authentication
=======================

By default ThunderRTC allows all connections, however it can be locked down to work against a variety of authentication methods. Most commonly this is done by sending a username and credential upon connecting to the server.

Even if authentication is not needed, setting the username can be used to create a visible alternative to the thunderrtcid.

Setting Username and Credential in JS Client
--------------------------------------------

**thunderrtc.setUsername()**

 - Use before connecting to the server via `thunderrtc.connect()` or `thunderrtc.easyApp()`
 - Shared to other connections in the same room
   - Can be used for setting a visible name (instead of thunderrtcid)
   - To avoid sharing username, embed it inside the credential via `thunderrtc.setCredential()`
 - Restricted by regular expression
   - Default is to allow up to 64 of any characters. 
   - In client JS, set `thunderrtc.usernameRegExp`
   - In server, set option `usernameRegExp`
 - Usernames should not be considered unique to a connection. One user could have multiple connections open. 
 - Value is sent to the server "authenticate" event listener  


    thunderrtc.setUsername("handsomeJack");


**thunderrtc.setCredential()**

 - Use before connecting to the server via `thunderrtc.connect()` or `thunderrtc.easyApp()`
 - Can contain any JSONable object
 - Value is sent to the server "authenticate" event listener  


    thunderrtc.setCredential({
      "password":"345RTC!",
      "realm":"thunderrtc.com",
      "apikey":"d834kds81vs189s10kkd4"
    });


Checking Authentication On Server
---------------------------------

**Using "authenticate" Event Listener**

The "authenticate" event is fired during the initial connection. The listener is provided with full details about the connection, so it may decide whether to authenticate or disconnect them.

In this simplistic example, any clients connecting to the adminSite application will be denied unless they have a username of "handsomeJack". Any clients connecting to any other application will be let through.


    var onAuthenticate = function(socket, thunderrtcid, appName, username, credential, thunderrtcAuthMessage, next){
      if (appName == "adminSite" && username != "handsomeJack"){
        next(new thunderrtc.util.ConnectionError("Failed our private auth."));
      }
      else {
        next(null);
      }
    };
    
    thunderrtc.events.on("authenticate", onAuthenticate);

 
**Listener Parameters:**

 - **socket**
   - Socket.io object for the specific socket connection 
   - The IP Address of the connection is available from `socket.handshake.address.address`
   - If using a proxy, the IP may be available from `socket.handshake.headers['x-forwarded-for']`
   - Referer *may* be available from `socket.handshake.headers.referer`
   - The socket can be disconnected using `socket.disconnect()` however it is recommended to call next() with an error
 - **thunderrtcid**
   - A unique identifier given to this connection
 - **appName**
   - The requested ThunderRTC application. Useful for application specific authentication.
 - **username**
   - Shared to other connections in the same room
     - Can be used for setting a visible name (instead of thunderrtcid)
     - To avoid sharing username, embed it inside the credential via `thunderrtc.setCredential()`
   - Restricted by regular expression
     - Default is to allow up to 64 of any characters. 
     - In client JS, set `thunderrtc.usernameRegExp`
     - In server, set option `usernameRegExp`
 - **credential**
   - Depending on authentication method, may be used for storing passwords, realms, hashes, apikeys, etc. 
   - Can be any JSONable object
   - Type checking should be performed 
 - **thunderrtcAuthMessage**
   - Includes the complete authentication message sent by the client
   - May be used to deny authentication based on requested rooms, api fields, etc. 
 - **next**
   - A callback function which should be called once (and only once)
   - If client should be authenticated, call with a null parameter
     - `next(null);`
   - If client should not be authenticated, call with an Error for the parameter
     - `next(new thunderrtc.util.ConnectionError("Failed our private auth."));`    

For more information about ThunderRTC server events, see [thunderrtc_server_events.md](thunderrtc_server_events.md)


If You Run Into Problems
------------------------
Please feel free to post on our discussion forum:

 - [https://groups.google.com/forum/#!forum/thunderrtc](https://groups.google.com/forum/#!forum/thunderrtc)
