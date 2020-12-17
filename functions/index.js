// TO GET THE EXPRESS APP RUNNING ON A CLOUD FUNCTION

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require ('stripe')('sk_test_51HwdGrCjGtqOXk9hfDOVt0qiQJTfIdbTkXWqJuy2mgy6LPZEY3cQohmCYD1zuwvXiUzTxNIXZ9vbuPmSGFEbnIZz00W1R7ENL9');

// API

// -App config
const app = express();

// -Middlewares
app.use(cors({origin: true}));
app.use(express.json());

// -API Routes
app.get('/', (request, response) => response.status(200).send('Hello Brain'))

app.post('/payments/create', async (request, response) => {
    const total = request.query.total;

    console.log('PAYMENT REQUEST RECEIVED >>>>', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, // sub units of the currency
        currency: 'usd'
    });

    //OK -Created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    }); 
});


// -Listen command
exports.appi = functions.https.onRequest(app)

//Example endpoint
//http://localhost:5001/my-e-clone-c271b/us-central1/appi 