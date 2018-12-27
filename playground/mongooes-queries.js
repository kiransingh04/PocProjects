const mongoos = require('../db/mongoose');
const { UserModel } = require('../models/users.model');

UserModel.findById('5bd8a23fcd8cad20b8d69470').then((todo=>{
    if(!todo){
        console.log("No todo found");
    }
    console.log("Todos", todo);
})).catch(e=>{
    console.log("Error", e);
})