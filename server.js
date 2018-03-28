require('dotenv').load();

const express = require('express');
var mustacheExpress = require('mustache-express');
var twilio = require('twilio');

const app = express();
const accountSid = process.env.TWILIO_ACME_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACME_AUTH_TOKEN;
const workspaceSid = process.env.TWILIO_ACME_WORKSPACE_SID;
const client = require('twilio')(accountSid, authToken);


// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());

app.set('view engine', 'mustache');

app.set('views', __dirname + '/views'); // you can change '/views' to '/public',
    // but I recommend moving your templates to a directory
    // with no outside access for security reasons

app.get('/', function (req, res) {
    res.render('index.html');
 	
});


app.get('/agent_list', function (req, res) {
     client.taskrouter.v1
  .workspaces(workspaceSid)
  .workers
  .list( { TargetWorkersExpression: 'worker.channel.chat.configured_capacity > 0' })
.then((workers) => {
	//console.log(workers);
	var voice_workers = workers;
  //workers.forEach((worker) => console.log(worker.friendlyName));
 // res.set({ 'content-type': 'application/json; charset=utf-8' })
 console.log(voice_workers);
  res.render('agent_list.html', {'voice_workers': voice_workers});
	 });
 	
});


  


/*
app.use(express.static(__dirname + '/public'));

//app.get('/', (req, res) => res.sendFile('index.html'));
app.get('/', function(req, res) 
{
	res.writeHead(200, {
  'Content-Type': 'text/html',
  'Content-Length': '6000',
  'Accept-Ranges': 'bytes',
  'Cache-Control': 'no-cache'

});

res.sendFile('index.html');
 

	
});

  
app.get('/agent_list', function(req, res) {

var voice_workers = client.taskrouter.v1
  .workspaces(workspaceSid)
  .workers
  .list( { TargetWorkersExpression: 'worker.channel.chat.configured_capacity > 0' })
.then((workers) => {
	console.log(workers);
  //workers.forEach((worker) => console.log(worker.friendlyName));
  res.sendFile(__dirname + '/public/agent_list.html');
  res.send(workers);
	 });
	
	
	
}); 


app.get('/agents', (req, res) => res.sendFile(__dirname + '/public/agent_desktop.html')); 


*/

app.listen(3000, () => console.log('Example app listening on port 3000!'));