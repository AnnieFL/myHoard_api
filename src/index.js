const express = require('express');
var cors = require('cors');
const app = express();

app.use(express.json({ limit: '50mb' }));

app.use(cors());

const usersRouter = require('./routes/usersRoutes');
app.use('/user', usersRouter);

const categoriesRouter = require('./routes/categoriesRoutes');
app.use('/category', categoriesRouter);

const thingsRouter = require('./routes/thingsRoutes');
app.use('/thing', thingsRouter);

app.listen(process.env.PORT || 3001);