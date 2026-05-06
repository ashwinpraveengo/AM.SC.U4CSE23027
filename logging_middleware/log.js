const express = require('express');
const logapp = express();
    
logapp.use(express.json());

logapp.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const baseUrl = 'http://20.207.122.201/evaluation-service/logs';

logapp.post('/', async (req, res) => {
    const reqbody={
        stack: 'backend',
        level: req.body.level,
        package: req.body.package,
        message: req.body.message
    };

    try {
        const response = await fetch(baseUrl,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqbody)
        });
        console.log('Success !');
        res.status(200).send('Log sent !');
    } catch (error) {
        console.error('Request failed :', error);
        res.status(500).send('Log req failed');
    }
});

module.exports=logapp;