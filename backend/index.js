const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Modal = require('./modal');
const StellarSdk = require('@stellar/stellar-sdk');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/stellarWallet', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.post('/create', async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }
    const existingModal = await Modal.findOne({email});
    if (existingModal) {
        return res.status(400).json({message: 'Email already exists'});
    }

    const pair = StellarSdk.Keypair.random();
    const secreteKey = pair.secret();
    const publicKey = pair.publicKey();
    const modal = new Modal({
        email,
        password,
        publicKey,
        secreteKey,
    });
    try {
        await modal.save();
        res.status(201).json(modal);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
