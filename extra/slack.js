var request = require('request');
const jsonToTable = require('json-to-table');


var obj = {'key1': 'application/json'}

		var msg = `
		stuff
		more stuff
		${obj.key1}
		stufff
		`

var options = {
    url: 'https://hooks.slack.com/services/',
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: `{"text": "${msg}"}`
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
