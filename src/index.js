const express = require('express');
const app = express();


app.use(express.json());

const usersRouter = require('./routes/usersRoutes');
app.use('/user', usersRouter);

const categoriesRouter = require('./routes/categoriesRoutes');
app.use('/category', categoriesRouter);

const thingsRouter = require('./routes/thingsRoutes');
app.use('/thing', thingsRouter);

app.listen(process.env.PORT || 3001);