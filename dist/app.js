"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
// Connect to MongoDB
mongoose_1.default.connect('mongodb+srv://justinefuraha14:JjwPs8ornn7Kcdfr@cluster0.bpbqjlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
const TodoSchema = new mongoose_1.Schema({
    title: String,
    completed: { type: Boolean, default: false }
});
const Todo = mongoose_1.default.model('Todo', TodoSchema);
// Middleware
app.use(body_parser_1.default.json());
// Routes
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    }
    catch (err) {
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
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
        res.json(todo);
    }
    catch (err) {
        res.status(404).json({ message: 'Todo not found' });
    }
});
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndRemove(req.params.id);
        res.json({ message: 'Todo deleted' });
    }
    catch (err) {
        res.status(404).json({ message: 'Todo not found' });
    }
});
// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
