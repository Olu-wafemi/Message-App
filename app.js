const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//Init app

const app = express()

//Template engone setup

app.set('view engine','html');
app.engine('html', ejs.renderFile)

//Public folder setup

app.use(express.static(__dirname + '/public'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true  }))

//Index route

app.get('/',(req, res)=>{
    res.render('index')
})


const Vonage = require('@vonage/server-sdk')


//Init nexmo 
const nexmo = new Nexmo({
    apiKey: '300d4de1',
    apiSecret: '0Lf1GfVNLvwJs1BE',
    
} ,{debug:true}) 

//Catch form response

app.post('/', (req,res) => {
    //res.send(req.body);
    //console.log(req.body)
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        'YourFriendlyNeighbour' ,number, text,{ type:'unicode' },(err,responseData)=>{
            if(err){
                console.log(err);
            } else{
                console.dir(responseData);
                //Get Data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']

                }

                //Emit to the client
                io.emit('smsStatus',data);
            }
        }
    )
})

// Define port
const port = 3000;

//Start server
const server = app.listen(port,()=> console.log(`Server started on port ${port} `))



//Connect to Socket.io

const io = socketio(server);
io.on('connection',() => {
    console.log('connected');
    io.on('disconnect', ()=> {
        console.log('Disconnected')
    })
})