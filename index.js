const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const envelopes = [];
let totalBudget = 0;

/*Set budget*/
app.post('/totalBudget', (req, res, next) => {
    const{budget} = req.body;

    totalBudget = budget;

    res.status(200).json({totalBudget});
});


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

     if(!envelope){
        return res.status(404).json({error: "No envelope found"});
     };

     res.status(200).json(envelope);
});

/*Update specific envelopes*/
app.put("/envelopes/:id", (req, res, next) => {
    const {id} = req.params;
    const {name, amount} = req.body;

    const envelopeToUpdate = envelopes.find(env => env.id === Number(id));

    if (name === undefined && amount === undefined){
        return res.status(400).json({error: "Must enter a name and/or amount"});
    }

    if(!envelopeToUpdate){
        return res.status(404).json({error: "Envelope not found"});
    }

    if (name !== undefined){
        envelopeToUpdate.name = name;
    }
    if (amount !== undefined){
        if(typeof amount != 'number' || amount < 0){
            return res.status(400).json({error: "You must enter a number for the amount"});
        }
        
        envelopeToUpdate.amount -= amount;
    }

    res.status(200).json({envelopeToUpdate});
    

});






app.listen(PORT, () => {
    console.log('Listening on port 3000');
});