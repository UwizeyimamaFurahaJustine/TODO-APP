const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

const apiUrl = 'http://localhost:3000/todos';

// Fetch all todos
async function fetchTodos() {
    try {
        const response = await axios.get(apiUrl);
        response.data.forEach(todo => addTodoToList(todo));
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Add todo to list
function addTodoToList(todo) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${todo.completed ? 'completed' : ''}">${todo.title}</span>
        <button class="delete-btn" data-id="${todo._id}">Delete</button>
    `;
    todoList.appendChild(li);
    li.querySelector('span').addEventListener('click', async () => {
        const todoId = todo._id;
        const updatedTodo = { completed: !todo.completed };
        try {
            const response = await axios.put(`${apiUrl}/${todoId}`, updatedTodo);
            li.querySelector('span').classList.toggle('completed');
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    });
}


// Handle form submit
todoForm.addEventListener('submit', async event => {
    event.preventDefault();
    const title = todoInput.value.trim();
    if (title) {
        try {
            const response = await axios.post(apiUrl, { title });
            addTodoToList(response.data);
            todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }
});

// Handle delete button click
todoList.addEventListener('click', async event => {
    if (event.target.classList.contains('delete-btn')) {
        const todoId = event.target.dataset.id;
        console.log(todoId);
        try {
            await axios.delete(`${apiUrl}/${todoId}`);
            event.target.parentElement.remove();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }
});

// Fetch todos when the page loads
fetchTodos();
