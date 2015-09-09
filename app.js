var express = require('express');
var request = require('request');
var app = express();

app.get('/', function (req, res) {
    res.send('Your IP is: ' + req.ip);
    console.log('Ping from: ' + req.ip);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});






var DASH_MAC = '74:c2:46:02:1c:72',
    DASH_IP = '10.1.10.85';


var pcap = require("pcap"),
    pcap_session = pcap.createSession("eth0", "arp"),
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
    //pushOver();
    
    sendTxt();
}

function sendTxt() {
    'use strict';
    
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
    var Pushover = require('node-pushover');
    var push = new Pushover({
        token: "akRJWSxpkF48Q6f84SzfUu4Yy7op2R",
        user: "uQMofiXKyCG1kfoB39gq8iBZB5mg4Y"
    });

    // No callback function defined:
    //push.send("Some title", "Node.js is Cool!! - no callback");

    // A callback function is defined:
    push.send("AmazonDash", "Button pressed.", function (err, res){
        if(err){
            console.log("We have an error:");
            console.log(err);
            console.log(err.stack);
        }else{
            console.log("Message send successfully");
            console.log(res);
        }
    });
}