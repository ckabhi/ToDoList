const express= require('express');
const User= require('../models').User;
const ToDoList = require('../models').ToDoList;
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const key= require('../constant');
const userAuth= require('../middlewares/userAuth');

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
                isLoggedIn: false,
                isSignUp: false,
                isPassword: true,
            });
        }else{
            res.json({
                username: req.body.username,
                isLoggedIn: false,
                isSignUp: true,
                isPassword: true,
            });
            
        }
        
    })
    .catch(err=>{
        res.status(500).json(err);
    });
});

//Login/ sign up
route.post('/entry',(req,res)=>{
    console.log("user", req.body.username, req);
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
                    // JWT token
                    const token= jwt.sign({
                        email: result.username,
                        userId: result.id
                    },
                    key.JWT_KEY,
                    {
                        expiresIn: "12h"
                    });
                    res.json({
                        id: result.id,
                        username: result.username,
                        name: result.name,
                        isLoggedIn: true,
                        isPassword: false,
                        token: token
                    });
                })
                .catch(err=>{
                    res.status(500).json(err);
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
                            // JWT token
                            const token= jwt.sign({
                                email: result.username,
                                userId: result.id
                            },
                            key.JWT_KEY,
                            {
                                expiresIn: "12h"
                            });
                            res.json({
                                    id: result.id,
                                    username: result.username,
                                    name: result.name,
                                    isLoggedIn: true,
                                    isSignUp: false,
                                    isPassword:false,
                                    token: token
                                });
                        } else{
                            res.json({
                                id: result.id,
                                username: result.username,
                                isLoggedIn: false,
                                isPassword: false
                            });
                        }
                    }
                });
            } else{
                res.status(403).json('error');
            }
        })
        .catch(err=>{
            res.status(500).json(err);
        });
    }
});

//get all list
route.post('/lists',userAuth,(req, res)=>{
    const username= req.userData.email;
        ToDoList.findAll({ where: {
            userId: req.userData.userId //userId from JWT
        }})
        .then(result =>{
            res.json(result);
        })
        .catch(err=>{
            res.status(500).json(err);
        });
    
})

//addList
route.post('/add', userAuth, (req,res)=>{
    ToDoList.create({
        userId: req.userData.userId,    //userId from JWT
        title: req.body.title,
        date: req.body.date,
        status: req.body.status
    })
    .then(result =>{
        if(result){     
            res.json(result);
        }
    })
    .catch(err=>{
        res.status(500).json(err);
    });
});

//edit List
route.put('/edit',userAuth , (req,res)=>{
    console.log(req);
    ToDoList.update({
        title: req.body.title,
        date: req.body.date,
        status: req.body.status
    },{
        where: {
            id: req.body.listid,
            userId: req.userData.userId     //userId from JWT
        }
    })
    .then(result =>{
        if(result){
            res.json(result);
        }else{
            res.status(500).json(result);
        }
    })
    .catch(err=>{
        res.status(500).json(err);
    });
});

// delete list
route.delete('/delete', userAuth, (req, res)=>{
    ToDoList.destroy({ where: {
        id: req.body.listId,
        userId: req.userData.userId  // userId from JWT
    }})
    .then(result =>{
        res.json(result);
    })
    .catch(err=>{
        res.status(500).json(err);
    });
});

module.exports = route;