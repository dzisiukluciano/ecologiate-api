var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function(codeParam, onResult)
{
    console.log("rest::getJSON");

    var options = {
        host: 'www.googleapis.com',
        https: true,
        path: '/customsearch/v1?'+
        'key=AIzaSyCExeME6nNWBsHRSAlAhGDXQ7UPZXdYu2s'+ //key de mi custom search
        '&cx=004997307265733943101%3Ayxvqxb5z0g0'+ //id del custom search
        '&q='+codeParam, //query del buscador
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    };

    var prot = ( options.https || options.port == 443 ) ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};