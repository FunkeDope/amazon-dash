//this file contains user names, pw's, api keys, and api tokens for some of the various APIs.
//either make your own credential file or just comment this out and fill in your api keys where needed
var creds = require('./creds');

const DASH_MAC = '74:c2:46:02:1c:72',
    DASH_IP = '10.1.10.85',
    INTERFACE = 'wlan0', //'eth0';
    DEV_MODE = true; //SPACEBAR emulates a button press

var pcap = require("pcap"),
    pcap_session = pcap.createSession(INTERFACE, "arp"),
    timeStamp = 0;

console.log("Listening on " + pcap_session.device_name);

//normalize mac
DASH_MAC.toLowerCase();

pcap_session.on('packet', function (raw_packet) {
    'use strict';
    var packet = pcap.decode.packet(raw_packet),
        device = packet.payload.payload.sender_ha.toString().toLowerCase();

    /*console.log('--------- NEW ARP -------------');
    console.log('sender_ha: ' + packet.payload.payload.sender_ha);
    console.log('sender_pa: ' + packet.payload.payload.sender_pa);
    console.log('target_ha: ' + packet.payload.payload.target_ha);
    console.log('target_pa: ' + packet.payload.payload.target_pa);
    console.log('----------------------');*/

    if(device === DASH_MAC) {
        var now = Date.now();
        if((now - timeStamp) >= 30000) { //multiple arp's are sent out within a few seconds of each other. we only need one.
            timeStamp = now;
            dashButtonPress();
        }
    }
});


function dashButtonPress() {
    'use strict';
    console.log('pressed!');
    pushOver();
    //sendTxt();
    //sendEmail();
}

function sendEmail() {
    'use strict';
    console.log('Sending Email');
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: 'smtp.mandrillapp.com',
        port: 25,
        auth: {
            user: creds.mandrill.user,
            pass: creds.mandrill.pass
        }
    });
    transporter.sendMail({
        from: '1337HAX0RZ@CORNERSTONEDISCOVERY.COM',
        to: 'kyle5077@gmail.com;jsilva@cornerstonediscovery.com;gwalters@cornerstonediscovery.com;bstofik@cornerstonediscovery.com',
        subject: 'YOUVE BEEN HACKED',
        html: '<img src="http://i.imgur.com/BWyVN3m.gif" style="width:800px" /><br><br><sm>I MEAN REPROGRAMMED!</sm>'
    });
}

function sendTxt() {
    'use strict';
    console.log('Sending text');
    request({
        url: 'http://textbelt.com/text',
        method: "POST",
        json: {
            number: '4845740761',
            message: 'AmazonDash button pressed. Kyle spam is next level...'
        }
    },function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else {
            console.log("error: " + error);
            console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText);
        }
    });
}

//send a push notification to pushover
function pushOver() {
    'use strict';
    console.log('Sending push notification');
    var Pushover = require('node-pushover');
    var push = new Pushover({
        token: creds.pushOver.token,
        user: creds.pushOver.user
    });

    // A callback function is defined:
    push.send("AmazonDash", "Button pressed.", function (err, res){
        if(err) {
            console.log("We have an error:");
            console.log(err);
            console.log(err.stack);
        }
        else {
            console.log("Message sent successfully");
            console.log(res);
        }
    });
}


// ----- for dev: space bar = dash press --------- //
if(DEV_MODE === true) {
    var keypress = require('keypress');
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);
    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        if(key && key.ctrl && key.name == 'c') {
            process.exit();
         }
         else if(key && key.name === 'space') {
             dashButtonPress();
         }
    });

    process.stdin.setRawMode(true);
    //process.stdin.resume();
}
