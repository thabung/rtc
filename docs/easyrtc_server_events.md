ThunderRTC Server: Events
======================

Customizing the server behavior of an ThunderRTC application is done by creating listeners and associating them with ThunderRTC events.


Event Methods
-------------

The ThunderRTC `events` object is directly accessible via the `thunderrtc` object. As a convienience it is also a child of the `pub`, `appObj`, `connectionObj`, `sessionObj`, `roomObj`, and `connectionRoomObj`.


### Setting Event Listeners

Setting event listeners in ThunderRTC is similar to the node.js events module method. Any differences are noted below.

    thunderrtc.events.on(eventName, listener);

 - All ThunderRTC events are limited to a single listener.
 - Setting a listener removes any current listeners, including default ThunderRTC listeners.


### Resetting Event To Default Listener

    thunderrtc.events.setDefaultListener(eventName);

 - Removes a custom listener from an event and then restores the ThunderRTC default Listener

### Emit an Event

    thunderrtc.events.emit(event, [arg1], [arg2], [...], [callback|next]);

 - See individual event documentation for parameter details.

### Emit a Default Event

Setting a listener overrides the default ThunderRTC listener. Depending on your application you may wish to release control back to the default ThunderRTC listener.

    thunderrtc.events.emitDefault(event, [arg1], [arg2], [...], [callback|next]);

 - Default event names are the same as public event names.
 - The parameter list is the same as the public listener. This includes the callback if present.


ThunderRTC Event Callback Convention
---------------------------------

Many ThunderRTC listeners include a callback as the last parameter. Conventions will differ depending on if it is named 'next' or 'callback'.

 - **next**
   - Informs ThunderRTC that your listener is done processing and to move onto the next stage of the operation. 
   - Expects a single 'err' parameter which should be null unless there is an error which should stop the operation and be logged.

 - **callback**
   - Informs ThunderRTC that your listener is done processing and to move onto the next stage of the operation.
   - The first parameter is always an 'err' type which should be null unless there is an error which should stop the operation and be logged.
   - See individual event documentation for the remaining parameters.


Event Documentation
-------------------

The best spot (currently) to see all the available events is by reading the default event listeners documentation. This will give you an idea of the events, parameters, and default behavior.

 - /docs/server_html_docs/module-thunderrtc_default_event_listeners-eventListener.html


If You Run Into Problems
------------------------
Please feel free to post on our discussion forum:

 - [https://groups.google.com/forum/#!forum/thunderrtc](https://groups.google.com/forum/#!forum/thunderrtc)
