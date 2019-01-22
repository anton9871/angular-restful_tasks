const express = require('express');
const app = express();

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public/dist/public")); //MUST point the server to the Angular folder
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RestfulTaskAPI', { useNewUrlParser: true });

var TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, default: "" },
    completed: { type: Boolean, required: true, default: false },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
})
const Task = mongoose.model('Task', TaskSchema);

//Retrieve
app.get('/tasks', function (req, res) {
    Task.find({}, function (err, data){
        if(err){
            return res.json({ status: "Error running query" , err:err});
        }
        else {
            return res.json({status: "Success running query", data: data});
        }
    })
})

//Retrieve specific id
app.get('/task/:id', function (req, res){
    Task.findById({_id: req.params.id}, function(err, data){
        if(err){
            return res.json({status: "Error running query", err:err});
        }
        else {
            console.log('task has been retrieved');
            return res.json({status: "Success running query", data: data});
        }
    })

})

//create
app.post('/task', function (req, res){
    var taskInstance = new Task ( req.body );
    console.log(req.body);
    taskInstance.save(function (err){
        if (err) {
            return res.json({status: "error creating document in DB", err: err});
        }
        else {
            return res.json({status: "Success adding document to DB", task: taskInstance});
        }
    })
})

//update
app.put('/task/:id', function (req, res){
    Task.findByIdAndUpdate({_id:req.params.id}, {$set: {title: req.body.title}}, function(err, data){
        if(err){
            console.log("document not found in db");
            return res.json({err: err});
        }
        else{
            console.log("successfully updated");
            console.log(req.body.title);
            return res.json({data:data})
        }
    })
})

//delete
app.delete('/task/:id', function (req, res){
    Task.findOneAndDelete({_id:req.params.id});
    return res.json({data: "Success deleting the object"});

})

app.listen(8000, function () {
    console.log("listening on port 8000");
})