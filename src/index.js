const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://justinefuraha14:JjwPs8ornn7Kcdfr@cluster0.bpbqjlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Todo Model
const Todo = mongoose.model('Todo', { 
    title: String,
    completed: { type: Boolean, default: false }
});

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/todos', async (req, res) => {
    const todo = new Todo({
        title: req.body.title
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
        res.json(todo);
    } catch (err) {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndRemove(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
