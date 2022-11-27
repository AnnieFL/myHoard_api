const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));

const usersRouter = require('./routes/usersRoutes');
app.use('/user', usersRouter);

const categoriesRouter = require('./routes/categoriesRoutes');
app.use('/category', categoriesRouter);

const thingsRouter = require('./routes/thingsRoutes');
app.use('/thing', thingsRouter);

app.listen(process.env.PORT || 3001);