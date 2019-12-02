const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const secretKey = '<SECRETKEY>';

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) =>{
    res.sendFile(__dirname + '/index.html');
    console.log('at home page');
});



app.post('/subscribe',(req,res)=>{

    if(!req.body.captcha){
        console.log("err");
        return res.json({"success":false, "msg":"Capctha is not checked"});
       
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

    request(verifyUrl,(err,response,body)=>{

        if(err){console.log(err); }

        body = JSON.parse(body);

        if(!body.success && body.success === undefined){
            return res.json({"success":false, "msg":"captcha verification failed"});
        }
        else if(body.score < 0.5){
            return res.json({"success":false, "msg":"you might be a bot, sorry!", "score": body.score});
        }
        
            // return json message or continue with your function. Example: loading new page, ect
            return res.json({"success":true, "msg":"captcha verification passed", "score": body.score});

    })

});



app.listen(3000,() =>{
    console.log('server is now up!');
});
