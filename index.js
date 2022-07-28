import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config();

const Port = process.env.PORT || 4000;

const ConnectionDB = async () => {
    try {
        mongoose.connect(process.env.MongoDB_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err)
    }
}
await ConnectionDB();

app.get('/', (req, res) => {
    res.send('Hello World from ToDo API');
})

app.use(cors());

app.use(express.json());

//Schemas and Models
const TaskSchema = new mongoose.Schema({
    todo : String,
    isComplete : Boolean
})

const Task = mongoose.model('task',TaskSchema)

//Routes
app.get('/api/tasks' , (req,res) => {
    Task.find((err,docs) => {
        if(err) console.log(err)
        res.send(docs)
    })
})

app.post('/api/tasks',(req,res) => {
    const task = new Task(req.body)
    task.save((err,doc) => {
        if(err) console.log(err)
        res.send(doc)
    })
})

app.put('/api/tasks/:id',(req,res) => {
    Task.findOneAndUpdate({
        _id : req.params.id
    },req.body,{
        new : true
    },(err,doc) => {
        if(err) console.log(err)
        res.send(doc)
    })
})

app.delete('/api/tasks/:id',(req,res) => {
    Task.findByIdAndDelete(req.params.id,(err,doc) => {
        if(err) console.log(err)
        res.send(doc)
    })
})


app.listen(Port, () => { console.log(`Server is running on port ${Port}`) });