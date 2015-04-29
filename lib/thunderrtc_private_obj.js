/**
 * @file        Maintains private object used within ThunderRTC for holding in-memory state information
 * @module      thunderrtc_private_obj
 * @author      CosRTC Software, info@thunderrtc.com
 * @copyright   Copyright 2014 CosRTC Software. All rights reserved.
 * @license     BSD v2, see LICENSE file in module root folder.
 */

// var _               = require("underscore");                // General utility functions external module
var defaultOptions  = require("./thunderrtc_default_options"); // ThunderRTC global variable
var g               = require("./general_util");            // General utility functions local module

var e = {};

e.version           = g.getPackageData("version");
e.serverStartOn     = Date.now();
e.option            = g.deepCopy(defaultOptions);
e.app               = {};

module.exports = e;
