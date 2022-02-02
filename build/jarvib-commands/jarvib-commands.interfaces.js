"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.Commands = void 0;
var Commands;
(function (Commands) {
    Commands["PING"] = "PING";
    Commands["GETSCHOLARS"] = "GETSCHOLARS";
    Commands["GETMMR"] = "GETMMR";
    Commands["GETSLP"] = "GETSLP";
    Commands["GETSTATS"] = "GETSTATS";
    Commands["GENERATEMYQR"] = "GENERATEMYQR";
})(Commands = exports.Commands || (exports.Commands = {}));
exports.help = "Hey, you can tell me what to do using these commands:\n" + "```" + "\n\n!jarvib " + Commands.PING + " - to get pong.\n\n!jarvib " + Commands.GETSCHOLARS + " - to get the link to view scholars and ronin addresses.\n\n!jarvib " + Commands.GETMMR + " {roninAddress} - to get the link to view scholars and ronin addresses. (e. g. " + "`" + "!jarvib getmmr ronin:94f1...9dc" + "`" + ")\n\n!jarvib " + Commands.GENERATEMYQR + " - to generate a new QR code. QR Code will be sent in private to the requestor if available.\n\n" + "```" + "\n";
