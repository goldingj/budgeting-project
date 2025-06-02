const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const envelopes = [];
const totalBudget = 0;


/* Create new envelopes */
app.post('/envelopes', (req, res, next) => {
    const {name, amount} = req.body;

    if(!name || !amount){
        return res.status(400).json({error: 'Must enter a name and an amount'});
    }

    const newEnvelope = {
        id: envelopes.length + 1,
        name,
        amount
    }

    envelopes.push(newEnvelope);

    res.status(201).json(newEnvelope);
});

/* Retrieve all envelopes*/
app.get('/envelopes', (req, res, next) => {
    res.json(envelopes);
})


/*Retrieve envelopes by id*/
app.get('/envelopes/:id', (req, res, next) => {
    const {id} = req.params;
     
     const envelope = envelopes.find(env => env.id === Number(id));

     //const envelope = envelopes.find(env => env.name.toLowerCase() === name.toLowerCase());

     if(!envelope){
        return res.status(404).json({error: "No envelope found"});
     };

     res.status(200).json(envelope);
});






app.listen(PORT, () => {
    console.log('Listening on port 3000');
});