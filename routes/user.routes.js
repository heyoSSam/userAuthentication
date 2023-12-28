const Router = require('express');
const db = require('../db');
const {check, validationResult} = require('express-validator');
const router = new Router();
const bcrypt = require('bcrypt')

router.get('/user/register', (req,res) => {
    res.render("signUp");
})

router.get('/user/login', (req,res) => {
    res.render("index");
})

router.get('/user/login/:id', (req,res) => {
    res.render("loggedIn");
})

router.post('/user/register', [
    check('login', 'The login field is empty')
        .trim()
        .notEmpty(),

    check('password', 'The password field is empty')
        .trim()
        .notEmpty()
], async (req, res) => {
    let error = validationResult(req);
    let allErrors = error.array();

    if(error.isEmpty()){
        let {login, password} = req.body,
            queryCheck = await db.query('SELECT login FROM users WHERE login = $1', [login]);
        
        password = bcrypt.hashSync(password, 10);
            
        if(queryCheck.rows.length == 0 )
            await db.query('INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *', [login, password]);
        else{
            let fail = {
                msg: "The entered login isn't free"
            }
            allErrors.push(fail);
        }
    }

    res.render("signUp", {allErrors});
});

router.post('/user/login', [
    check('login', 'The login field is empty')
        .trim()
        .notEmpty(),

    check('password', 'The password field is empty')
        .trim()
        .notEmpty()
], async (req, res) => {
    let error = validationResult(req),
        allErrors = error.array();

    if(error.isEmpty()){
        const loginCheck = req.body.login,
            passwordCheck = req.body.password,
            loginQuery = await db.query('SELECT login FROM users WHERE login = $1', [loginCheck]),
            passwordQuery = await db.query('SELECT password FROM users WHERE login = $1', [loginCheck]),
            loginRight = loginQuery.rows.length == 0 ? null : loginQuery.rows[0].login;
            passwordRight = passwordQuery.rows.length == 0 ? null : passwordQuery.rows[0].password;
            
        if(loginCheck == loginRight && bcrypt.compare(passwordCheck, passwordRight)){
            let id = await db.query('SELECT id FROM users WHERE login = $1', [loginCheck]);
            id = id.rows[0].id;
            let link = "/user/login/" + id;
            res.redirect(link);
        }
        else{
            let fail = {
                msg : 'The login or password is incorrect'
            }
            allErrors.push(fail);}
        }

    res.render("index", {allErrors});
});

module.exports = router;