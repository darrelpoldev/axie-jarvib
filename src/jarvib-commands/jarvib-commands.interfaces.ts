export enum Commands {
  PING = "PING",
  GETSCHOLARS = "GETSCHOLARS",
  GETMMR = "GETMMR",
  GETSLP = "GETSLP",
  GETSTATS = "GETSTATS",
  GENERATEMYQR = "GENERATEMYQR"  
}

export const help: string = `Hey, you can tell me what to do using these commands:
${"```"}\n
!jarvib ${Commands.PING} - to get pong.\n
!jarvib ${Commands.GETSCHOLARS} - to get the link to view scholars and ronin addresses.\n
!jarvib ${Commands.GETMMR} {roninAddress} - to get the link to view scholars and ronin addresses. (e. g. ${"`"}!jarvib getmmr ronin:94f1...9dc${"`"})\n
!jarvib ${Commands.GENERATEMYQR} - to generate a new QR code. QR Code will be sent in private to the requestor if available.\n
${"```"}\n`
