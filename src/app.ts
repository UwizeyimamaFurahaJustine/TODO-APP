import express, { Request, Response } from 'express';
import mongoose, { Document, Schema, Model } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://justinefuraha14:JjwPs8ornn7Kcdfr@cluster0.bpbqjlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Todo Interface and Model
interface ITodo extends Document {
    title: string;
    completed: boolean;
}

const TodoSchema = new Schema({
    title: String,
    completed: { type: Boolean, default: false }
});

const Todo: Model<ITodo> = mongoose.model('Todo', TodoSchema);

// Middleware
app.use(bodyParser.json());


// Routes
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/todos', async (req: Request, res: Response) => {
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

app.put('/todos/:id', async (req: Request, res: Response) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
        res.json(todo);
    } catch (err) {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
    try {
        await Todo.findByIdAndRemove(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
