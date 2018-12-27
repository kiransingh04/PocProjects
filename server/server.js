require('../config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const { mongoose } = require('../db/mongoose');
const { UserModel, TodoModel } = require('../models');
const { authenticate} = require('./../middleware/authenticate')

const app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
   let toDo = new TodoModel({
        text:req.body.text, 
        _creater:req.user._id
   })
   toDo.save().then((d)=>{
    res.send(d);
   }).catch(e=>{
        res.status(400).send(e);
   })
});

app.get('/todos', authenticate,(req, res)=>{
     TodoModel.find({_creater: req.user._id}).then(todos=>{
        res.send({
            todos
        })
     }).catch(e=>{
        res.status(400).send(e);
     });
 })

 app.get('/todos/:id', (req, res)=>{
     let id = req.params.id; 
     if(!ObjectId.isValid(id)){
        res.status(404).send();
     }
    TodoModel.findById(id).then(todo=>{
        if(!todo){
            res.status(404).send();
        }
        res.send({
            todo
        })
    }).catch(e=>{
       res.status(404).send();
    });
})

app.delete('/todos/:id', authenticate, (req, res)=>{
    let id = req.params.id; 
    if(!ObjectId.isValid(id)){
       res.status(404).send();
    }
   TodoModel.findOneAndDelete({_id: id, _creater : req.user._id}).then(todo=>{
       if(!todo){
           res.status(404).send();
       }
       res.send({
           todo
       })
   }).catch(e=>{
      res.status(404).send();
   });
})

// Users 
app.post('/users', (req, res)=>{
    const userData = _.pick(req.body, ['email','password']);
    const user = new UserModel(userData);
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        console.log('token', token);
        res.header('x-auth', token).send(user);
    }).catch(e=>{
        console.log(e);
        res.status(400).send(e)
    });
 });

 app.get('/users/me',authenticate,  (req, res)=>{
     res.send(req.user)
 });

app.post('/users/login', (req, res)=>{
    const userData = _.pick(req.body, ['email','password']);
   
    UserModel.findByCredentials(userData).then((user)=>{
       return user.generateAuthToken().then(token=>{
        res.header('x-auth', token).send(user);
     });
    }).catch(e=>{
        console.log(e);
        res.status(401).send('Login failed');
    }); 
});

app.delete('/users/logout',authenticate, (req, res)=>{
   req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
   }).catch(e=>{
    res.status(400).send();
   })
});
app.listen(process.env.PORT, ()=>{
    console.log(`server running at ${process.env.PORT}`);
});