const express= require('express');
const User= require('../models').User;
const ToDoList = require('../models').ToDoList;
const bcrypt= require('bcrypt');

const route= express.Router();

// check if user exist
route.post('/checkuser',(req,res)=>{
    User.findOne({ where: {
        username: req.body.username
    }}).then(user =>{
        if(user){
            res.json({
                id:user.id,
                username: user.username,
                name: user.name,
                isLogedIn: false,
                isSignUp: false
            });
        }else{
            res.json({
                username: req.body.username,
                isLogedIn: false,
                isSignUp: true
            });
            
        }
        
        // console.log(user.hasOwnProperty(key));
    })
});

//Login/ sign up
route.post('/entry',(req,res)=>{
    if(req.body.name){      //Sign Up
        
        bcrypt.hash(req.body.password, 10, (error, hash)=>{
            if(!error){
                req.body.password= hash;
                User.create({
                    username: req.body.username,
                    name: req.body.name,
                    password: req.body.password
                })
                .then(result =>{
                    res.json({
                        id: result.id,
                        username: result.username,
                        name: result.name,
                        isLogedIn: true
                    });
                });
            }
        });

    }else{      //Login
        User.findOne({ where: {
            username: req.body.username
        }})
        .then(result => {
            if (result){
                bcrypt.compare(req.body.password, result.password, (error, response)=>{
                    if(error){
                        res.status(401).json('Auth failed');
                    }else{
                        if (response){
                            res.json({
                                id: result.id,
                                username: result.username,
                                name: result.name,
                                isLogedIn: true
                            });
                        } else{
                            res.json({
                                id: result.id,
                                username: result.username,
                                isLogedIn: false
                            });
                        }
                    }
                });
            } else{
                res.status(403).json('error');
            }
        })
    }
});

//get all list
route.get('/lists',(req, res)=>{
    if(req.body.userid){
        ToDoList.findAll({ where: {
            userId: req.body.userid
        }})
        .then(result =>{
            res.json(result);
        })
    }else{
        res.status(400).json('field are missing');
    }
})

//addList
route.post('/add', (req,res)=>{
    ToDoList.create({
        userId: req.body.userid,
        title: req.body.title,
        date: req.body.date,
        status: req.body.status
    })
    .then(result =>{
        if(result){     // It will send full list
            ToDoList.findAll({ where: {
                userId: req.body.userid
            }})
            .then(listResult =>{
                res.json(listResult);
            })
        }
    })
});

//edit List
route.put('/edit', (req,res)=>{
    ToDoList.update({
        title: req.body.title,
        date: req.body.date,
        status: req.body.status
    },{
        where: {
            id: req.body.listid
        }
    })
    .then(result =>{
        if(result){
            ToDoList.findAll({ where: {
                userId: req.body.userid
            }})
            .then(listResult =>{
                res.json(listResult);
            })
        }
    })
});

// delete list
route.delete('/delete', (req, res)=>{
    ToDoList.destroy({ where: {
        id: req.body.listid
    }})
    .then(result =>{
        ToDoList.findAll({ where: {
            userId: req.body.userid
        }})
        .then(listResult =>{
            res.json(listResult);
        })
    })
});

module.exports = route;