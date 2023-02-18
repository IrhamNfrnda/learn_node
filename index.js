let express = require('express');
let app = express();
var bodyParser = require("body-parser");

console.log('Hello World');

absolutePath = __dirname + "/views/index.html";
const json = {
  "message": "Hello json"
}

//Middleware 
app.use(function middleware(req, res, next) {
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
});

//Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({ extended: false }));

//Middleware to Access Public Directory
app.use('/public', express.static(__dirname + '/public'))

//Send File as Response
app.get('/', function(req, res) {
  res.sendFile(absolutePath);
})

//Check Private Key In .env
app.get('/json', function(req, res) {
  const message_style = process.env['MESSAGE_STYLE'];

  if(message_style === 'uppercase'){
    json.message = json.message.toUpperCase();
    res.json(json);
  }else{
    res.json(json);
  }
   
})

//Chain Middleware
app.get('/now', function(req, res, next) {
  req.time = new Date().toString(); 
  next();
}, function(req, res) {
  res.json({"time": req.time});
});

//Get Parameter From Route
app.get('/:word/echo', function(req, res) {
  const word = req.params.word;
  res.json({
    "echo":word
  })
})

//Get Query Parameter Input from the Client And Chain Route
app.route('/name').get(function(req,res){
  const json_name = {
    "name": req.query.first + " " + req.query.last
  }
  res.json(json_name);
}).post(function(req,res){
  const json_name = {
    "name": req.body.first + " " + req.body.last
  }
  res.json(json_name);
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});