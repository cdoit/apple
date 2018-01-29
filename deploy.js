var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/push', secret: 'myHashSecret' }) 

function run_cmd(cmd, args, callback) {

	var exec = require('child_process').exec;  
	exec('deploy.bat', function(error, stdout, stderr){ 
	  if ( !error ) {
		  callback(stdout);
	  } else {
		  console.log(error);
	  }
	});
}
 
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(3001)
console.log("启动监听3001");
 
handler.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler.on('push', function (event) {
	console.log('PUSH');
  // console.log('Received a push event for %s to %s',
    // event.payload.repository.name,
    // event.payload.ref);
  run_cmd('cmd ', 'deploy.bat', function(text){ console.log(text) });
})
 
/*
handler.on('issues', function (event) {
  console.log('Received an issue event for % action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
*/