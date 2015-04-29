![ThunderRTC](./api/img/thunderrtc.png "ThunderRTC")

ThunderRTC
=======

**A bundle of Open Source WebRTC joy!**

CosRTC's ThunderRTC, a bundle of Open Source WebRTC joy, incorporates an ThunderRTC server install and client API, and working, HTML5 and JavaScript, application source code under a BSD 2 license.


Features
--------
 * Install ThunderRTC's WebRTC Server on your own Linux, Windows, or Mac server in minutes not days.
 * Use our ThunderRTC API and sample application code to build and deploy your WebRTC app in hours not weeks.
 * ThunderRTC is completely free and open source under a BSD 2 license. No usage costs or other hidden fees.


Installation In A Nutshell
--------------------------
 1. Install [Node.js](http://nodejs.org)
 2. Download files from [server_example/](./server_example/) and place them in a local folder of your choice.
    - [package.json](./server_example/package.json)
    - [server.js](./server_example/server.js)
    - OR [download and extract this .zip](http://thunderrtc.com/files/thunderrtc_server_example.zip)
 3. Run `npm install` from the installation folder to install dependent packages (including ThunderRTC)
 4. Start ThunderRTC by running `node server.js`
 5. Browse the examples using a WebRTC enabled browser. *(defaults to port `8080`)*

Step by step instructions including additional setup options can be found in `/docs/thunderrtc_server_install.md`

Note: there is no corresponding need to install the client files specifically; they were installed as part of ThunderRTC in step 3.

Documentation
-------------
All documentation can be found within [the docs folder](./docs/).

**ThunderRTC Server**

 * [Install instructions for Ubuntu, Windows, and Mac](./docs/thunderrtc_server_install.md)
     * `/docs/thunderrtc_server_install.md`
 * [Configuration options](./docs/thunderrtc_server_configuration.md)
     * `/docs/thunderrtc_server_configuration.md`
 * [Using Server Events](./docs/thunderrtc_server_events.md)
     * `/docs/thunderrtc_server_events.md`  
 * Server API
     * `/docs/server_html_docs/index.html`  

**ThunderRTC Client API**
 * [Client API tutorial](./docs/thunderrtc_client_tutorial.md)
     * `/docs/thunderrtc_client_tutorial.md`
 * Client API
     * `/docs/client_html_docs/thunderrtc.html`
 * Client File Transfer API
     * `/docs/client_html_docs/thunderrtc_ft.html`

**General Development**
 * [Frequently asked questions](./docs/thunderrtc_faq.md)
     * `/docs/thunderrtc_faq.md`
 * [Authentication](./docsthunderrtc_authentication.md/)
     * `/docs/thunderrtc_authentication.md`  
 * [ICE, TURN, STUN Configuration](./docs/thunderrtc_server_ice.md)
     * `/docs/thunderrtc_server_ice.md`  
 * [Using Rooms](./docs/thunderrtc_rooms.md)
     * `/docs/thunderrtc_rooms.md`  
 * [Serving with SSL](./docs/thunderrtc_server_ssl.md)
     * `/docs/thunderrtc_server_ssl.md`  
 * [Serving next to IIS or Apache](./docs/thunderrtc_with_other_servers.md)
     * `/docs/thunderrtc_with_other_servers.md`  
 * [Upcoming features](./docs/thunderrtc_upcoming_features.md)
     * `/docs/thunderrtc_upcoming_features.md`
 * [Changelog](./docs/thunderrtc_changelog.md)
     * `/docs/thunderrtc_changelog.md`


Folder Structure
----------------

 * / (root)
   * Licenses and package information
 * /api/
   * Client API files including thunderrtc.js  
 * /demos/
   * ThunderRTC live demos and example code
 * /docs/
   * Documentation for using the API and running the server
 * /lib/
   * Required libraries
 * /node_modules/
   * Required node.js modules
   * This folder will be created during the install
 * /server_example/
   * A simple server example  


Included Demos
--------------

ThunderRTC comes with a number of demo's which work immediately after installation.

 * Video and/or Audio connections
 * Multi-party video chat
 * Text Messaging with or without Data Channels
 * Screen and tab sharing
 * File transfer


Links for help and information
------------------------------

* The ThunderRTC website is at:
  * [http://www.thunderrtc.com/](http://www.thunderrtc.com/)
* Use our support forum is at:
  * [https://groups.google.com/forum/#!forum/thunderrtc](https://groups.google.com/forum/#!forum/thunderrtc)
* Live demo site:
  * [http://demo.thunderrtc.com/](http://demo.thunderrtc.com/)
* Bugs and requests can be filed on our github page or on the forum:
  * [https://github.com/CosRTC/thunderrtc/issues](https://github.com/CosRTC/thunderrtc/issues)
* Our YouTube channel has live demo's:
  * [http://www.youtube.com/user/CosRTC](http://www.youtube.com/user/CosRTC)


License
-------

Copyright (c) 2014, CosRTC Software Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.