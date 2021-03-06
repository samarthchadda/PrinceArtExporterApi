const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/_.princeartstore.com_private_key.key');
var certificate = fs.readFileSync('./sslcert/princeartstore.com_ssl_certificate.cer');

var credentials = {key: privateKey, cert: certificate};

require('dotenv').config({path: __dirname + '/.env'})
var tokenFile = require('./services/verifyTokenFile');

const mongoConnect = require('./util/database').mongoConnect;

const app = express();

const userRoutes = require('./routes/user');
const quotationRoutes = require('./routes/quotation');
const productRoutes = require('./routes/product');

app.use('/uploads',express.static('uploads'));


app.use(bodyParser.json());  //for application/json data


//enabling CORS package
app.use((req,res,next)=>{
    //setting header to all responses
    res.setHeader('Access-Control-Allow-Origin','*');  
                                           
                        //specifying which methods are allowed
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');

    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');

    next();  //so that request continues to next middleware
});

app.get('/',(req,res)=>{
    res.json({message:"deploy api"});
});

app.use('/api',userRoutes);
app.use('/api',quotationRoutes);
app.use('/api',productRoutes);

var httpsServer = https.createServer(credentials, app);

let port = process.env.PORT || 443;
//establishing DB connection
mongoConnect(()=>{
     
    //listening to incoming request on this port
   
    // app.listen(port);
    httpsServer.listen(port);

});

