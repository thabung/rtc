ThunderRTC: FAQ
============

What is WebRTC?
---------------

WebRTC allows real-time communications within the browser without the need for plugins. A few of its greatest benefits include:

 - Standardized methods of connecting to web cameras and microphones.
 - Peer to peer connections. Improves latency and reduces bottlenecks on the servers.
 - Standardized negotiation for streaming audio, video and data.


What is ThunderRTC?
----------------

ThunderRTC removes the pain associated with getting started with WebRTC with the following cool features:

 - Cross browser support.
 - Working source code.
 - Easy server install.
 - WebSocket server.
 - Single language for server and clients (JavaScript).
 - Open Source and free!

Why is WebRTC Hard?
-------------------

The WebRTC API is a mid-level API. That is to say, that while it insulates the developer from stuff like connecting to cameras or contacting TURN and STUN servers, it still requires the developers to implement an involved message passing scheme between clients to establish the peer to peer connection.

The ThunderRTC framework provides that message passing scheme so that the developer can focus on the tasks that are actually relevant to them.


ThunderRTC Requirements:
--------------------

So far we have tested ThunderRTC on Windows 7, 8, OS-X, Raspberry Pi, and Ubuntu 12.04 LTS where users have administrator or sudo access.

For the most part, if you can run Node.JS, you can run ThunderRTC.


Is ThunderRTC production ready?
----------------------------

We have used ThunderRTC in production since May of 2013 (see [https://tawk.com](https://tawk.com "tawk.com")). The included demos include notes about what browsers the various features work in, or how experimental the feature is.

There is a lot of work still to go in providing additional features which production code will need. We invite all users to give us feedback as to what features you desire.


Is WebRTC production ready?
---------------------------

Many products and services utilizing WebRTC have already been released despite the specification not yet being finalized. The original posted date for reaching recommendation status was overly optimistic (Q1 2013). With implementation methods still being debated, be prepared for it to take until Q4 2014 (or longer).

As the specification gets closer to recommendation status, we expect those browsers which are currently working on WebRTC to better communicate with each other. Currently the biggest contended issues surround video codec requirements.

Some browsers may wait until after the standard reaches recommendation status to implement WebRTC.

Screen sharing
--------------

WebRTC has screen capture and sharing but with following issues:
- It's not supported by Firefox.
- It can only be accessed from a page hosted on an SSL server.
- You may need to enable a chrome flag on the sending browser.
- The video is usually down sampled by 2 in each dimension before transmission to another computer.
- Some people can't seem to get it to work on their machine. There isn't much we can do to change that.


Recording Audio and Video
-------------------------
Recording audio and video requires a media server. This version of ThunderRTC does not support any media servers. 


How About Data Channels?
------------------------

The data channel portion of the specification is close to being finalized. Browser support is getting better, with inter-optibility among desktop Chrome and Firefox now possible.

ThunderRTC supports automatic fail-over to websockets in those cases where data channel support is spotty.


How about Multi-way Conversations?
----------------------------------

ThunderRTC includes a demo showing up to four connections in a star configuration. Each peer establishes a connection to every other peer.

Check out [tawk.com](http://tawk.com) for an in-production example.

More advanced conference and multicast requirements would require a dedicated WebRTC capable conference server or [MCU](http://en.wikipedia.org/wiki/Multipoint_control_unit "MCU"). ThunderRTC does not yet include direct support for these. We are working with various vendors to gain this support.


Why use Node.js?
----------------

Node.JS is a powerful asynchronous server platform which has several qualities we find enduring:

 - Performs exceptionally well as a HTML5 socket server.
 - Easy to program for with a thriving open source community to back it up.
 - Multi-platform! Allows installs on Linux, Windows, and Macs.
 - The Node Package Manager provides an easy way to distribute and install ThunderRTC.


Are there plans to integrating with SIP?
----------------------------------------

SIP is an extensive protocol, and developing a WebRTC platform which supports it in a way casual developers could use it would be difficult. 


What are the common connection, audio, and video problems?
----------------------------------------------------------

See our separate document: WebRTC Problems and Possible Fixes


How do I report bugs or ask for features?
-----------------------------------------

We monitor both the Github issue tracker and the Google Groups discussion forum.

 - [https://github.com/CosRTC/thunderrtc/issues](https://github.com/CosRTC/thunderrtc/issues)
 - [https://groups.google.com/forum/?forum/#!forum/thunderrtc](https://groups.google.com/forum/?forum/#!forum/thunderrtc)


You Didn't Answer My Question!
------------------------------
 Ask away on our forum. We do monitor it!

 - [https://groups.google.com/forum/?forum/#!forum/thunderrtc](https://groups.google.com/forum/?forum/#!forum/thunderrtc)
 
How do I get help?
------------------
If you need confidential assistance, you can contact our services division at info@CosRTC.com.

Otherwise, feel free to ask on our forum (see above). Be as clear, precise, and concrete as possible; while it may sometimes appear otherwise, our mindreading abilities are limited in range to about 40 ft.

If you are going to post a problem report, bear in mind that you should include the files needed to reproduce your problem, trimmed down to the minimum needed to demonstrate the problem. The easier you make it for someone to help you, the more likely they'll bother. 
