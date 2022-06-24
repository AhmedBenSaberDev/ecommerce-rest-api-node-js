require('dotenv').config();
require('./config/db');

const path = require('path');

const bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use('/uploads/images',express.static(path.join('uploads','images')))

app.use(bodyParser.json());


// Routes
const productRoutes = require('./routes/Product-routes');
const userRoutes = require('./routes/User-routes');
const orderRoutes = require('./routes/order-routes');

app.use('/api',productRoutes);
app.use('/api',userRoutes);
app.use('/api',orderRoutes);

app.get('/api/config/paypal',(req,res) => {
    res.send(process.env.PAYPAL_ID);
});


// app.use((error,req,res,next) => {
//     if(req.file){
//         fs.unlink(req.file.path, err => {
//             console.log(err);
//         })
//     }
//     if(res.headerSent){
//         return next(error);
//     }
//     res.status(error.code || 500);
//     res.json({message:error.message || "An unknown error occured" })
// });

app.listen(process.env.PORT);