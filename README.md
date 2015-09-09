# AmazonDash Button: Node.js Trigger
Captures the ARP request sent out by the AmazonDash button and allows a user to run custom code.

Current functions allow for Email, Text message, or Push Notification to a smart device, however the possibilities for integration are virutally limitless once configured.

## Setup
Make sure you have build tools and libpcap installed
> sudo apt-get install --yes build-essential
> sudo apt-get install libpcap-dev

Clone master branch
> git clone https://github.com/FunkeDope/amazon-dash.git

NPM Install
> sudo npm install

## API Credentials
By default, all credentials are stored in a file called "creds.js" in the root directory. You can either make this file yourself or just comment it out and manually supply your own API keys and usernames/passwords where needed, or you can make your own. Should look something like this:
    module.exports = {
        mandrill: {
            user: 'mandrill@user.com',
            pass: 'password'
        },
        pushOver: {
            user: 'user token',
            token: 'api token'
        }
    };

## Usage
TODO