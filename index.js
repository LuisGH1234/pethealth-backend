const express = require('express');
const app = express();
const util = require('util');
const moment = require('moment');
const mysqlConnection = require('./connection');

mysqlConnection.query = util.promisify(mysqlConnection.query);

// Settings
app.set('port', process.env.PORT || 3001);
//Middleware
//si estamos recibiendo un json lo convierte y sera accesible en las rutas
app.use(express.json());

// inject an error handling middleware
app.use((e, req, res, next) => {
    return res.status(500).json(
        {
            route: req.originalUrl,
            error: { stack: e.stack }
        }
    );
});

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', '*');
    next();
})
// Routes
app.post('/api/register', async (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*');
    const { 
        name, 
        email, 
        date = moment().format("YYYY-MM-DD HH:mm:ss"),
    } = req.body;
    
    let sql = 'INSERT INTO pethealth(name, email, date) values (?, ?, ?)';
    try {
        await mysqlConnection.query(sql, [name, email, date]);
        return res.status(200).end();
    } catch (error) {
        console.log(error);
        return res.status(404).json({status: "error", error });
    }
});

app.get('/api/register', async (req, res) => {
    // res.set('Access-Control-Allow-Origin', '*');
    const { clean = 'true' } = req.query;
    const sql = 'SELECT * FROM pethealth';
    try {
        const result = await mysqlConnection.query(sql);
        return res.status(200).json({ 
            registrations: clean == 'true' ? 
                result.map(x => ({ name: x.name, email: x.email })) :
                result
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ status: "error", error });
    }
});

// Report
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
