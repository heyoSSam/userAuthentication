const express = require('express')
const path = require('path')
const userRouter = require('./routes/user.routes')
const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(userRouter);



app.listen(PORT);

