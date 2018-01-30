var http = require('http'); 
   
var qs = require('querystring'); 
module.exports = {   
    get: function(host,port,path) {
        var options = { 
            hostname: host, 
            port: port, 
            path: path, 
            method: 'GET' 
        }; 
        
        var req = http.request(options, function (res) { 
            console.log('STATUS: ' + res.statusCode); 
            console.log('HEADERS: ' + JSON.stringify(res.headers)); 
            res.setEncoding('utf8'); 
            res.on('data', function (chunk) { 
                console.log('BODY: ' + chunk); 
            }); 
        }); 
        
        req.on('error', function (e) { 
            console.log('problem with request: ' + e.message); 
        }); 
        
        req.end();
    },
    post: function(host,port,path, data) {
        var contents = querystring.stringify({
            name:'byvoid',
            email:'byvoid@byvoid.com',
            address:'Zijing'
        });
         
        var options = {
            host:host,
            port: port, 
            path:path,
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlendcoded',
                'Content-Length':contents.length
            }
        }
         
        var req = http.request(options, function(res){
            res.setEncoding('utf8');
            res.on('data',function(data){
                console.log("data:",data);   //一段html代码
            });
        });
         
        req.write(contents);
        req.end;
    }
};