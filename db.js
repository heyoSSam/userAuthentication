const Pool = require('pg').Pool;
const pool = new Pool({
    user:'postgres',
    password: 'heyoSSam777',
    host:'localhost',
    port:5432,
    database:'labBack'
});

module.exports = pool; 