const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const envelopes = [];


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

/*Delete an Envelope*/

app.delete("/envelopes/:name", (req, res, next) => {
    const {name} = req.params;

    const envelopeToDelete = envelopes.findIndex(env => env.name.toLowerCase() === name.toLowerCase());

    if (envelopeToDelete === -1){
        return res.status(404).json({error: "Envelope not found"});
    }

    const deletedEnvelope = envelopes.splice(envelopeToDelete , 1)[0];

    return res.status(200).json({message: "Envelope deleted", deletedEnvelope});
});


/*Transfer balance from one envelope to another*/
app.post('/envelopes/transfer/:fromId/:toId', (req, res, next) => {
    const {fromId, toId} = req.params;
    const {amount} = req.body;

    const envelopeComingFrom = envelopes.find(env => env.id === Number(fromId));
    const envelopeGoingTo = envelopes.find(env => env.id === Number(toId));

    if(!envelopeComingFrom){
        return res.status(404).json({error: "No envelope found to withdrawal from"});
    }

    if (!envelopeGoingTo){
        return res.status(404).json({error: "No envelope to deposit to"});
    }

    if (typeof amount !== 'number' || amount < 0){
        return res.status(404).json({error: "Valid number must be entered"});
    }

    if (envelopeComingFrom.amount <= amount){
        return res.status(404).json({error: "Balance too low to withdrawal from"});
    }

    envelopeComingFrom.amount -= amount;
    envelopeGoingTo.amount += amount;

    return res.status(200).json({message: "Transfer complete"});
})



app.listen(PORT, () => {
    console.log('Listening on port 3000');
});