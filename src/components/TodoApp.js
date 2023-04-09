import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/todo/')
      .then(response => setTodos(response.data.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/todo/', { task: newTodo })
      .then(response => {
        axios.get('http://localhost:8080/todo/')
        .then(response => setTodos(response.data.data))
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/todo/${id}`)
      .then(response => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => console.log(error));
  };

  const handleToggle = (id) => {
    console.log("hey" , id)
    const data = {
        task: todos.find(todo => todo.id === id).task,
        done: !todos.find(todo => todo.id === id).done,
        createdAt: todos.find(todo => todo.id === id).createdAt,
        completedAt: new Date().toISOString()
      };

    console.log(data)
    axios.put(`http://localhost:8080/todo/${id}`, data)
      .then(response => {
        axios.get('http://localhost:8080/todo/')
            .then(response => setTodos(response.data.data))
            .catch(error => console.log(error));
        })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        <button type="submit">Add Todo</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Task</th>
            <th>Done ?</th>
            <th>CreatedAt</th>
            <th>CompletedAt</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.task}</td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
              </td>
              <td>{todo.createdAt}</td>
              <td>{todo.completedAt || '-'}</td>
              <td>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoApp;