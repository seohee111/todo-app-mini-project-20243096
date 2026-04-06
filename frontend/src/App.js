import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// ✨ 로컬(5000포트)과 배포 환경(/api)을 자동으로 구분하는 주소 설정
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/todos' 
  : '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  // 1. 데이터 불러오기 (GET)
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) { 
      console.error("데이터 로딩 실패:", error); 
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. 새 일정 추가 (POST)
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(API_URL, { 
        title: newTodo, 
        date: dueDate 
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) { 
      console.error("추가 실패:", error); 
    }
  };

  // 3. 완료 상태 토글 (PUT)
  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { 
        completed: !completed 
      });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
    } catch (error) { 
      console.error("상태 변경 실패:", error); 
    }
  };

  // 4. 삭제 (DELETE)
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) { 
      console.error("삭제 실패:", error); 
    }
  };

  const harvestedApples = todos.filter(t => t.completed);

  return (
    <div className="app-wrapper">
      <div className="main-container">
        
        <div className="summary-row">
          <div className="summary-box completed">
            <span className="label">수확한 사과</span>
            <span className="count">{harvestedApples.length}</span>
          </div>
          <div className="summary-box ongoing">
            <span className="label">덜 익은 사과</span>
            <span className="count">{todos.length - harvestedApples.length}</span>
          </div>
        </div>

        <div className="section-header">
          <h1 className="title">Todo List</h1>
          <div className="date-selector">
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              className="header-date-input" 
            />
          </div>
        </div>

        <form onSubmit={addTodo} className="input-group">
          <input 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="어떤 사과가 나올까요?..." 
          />
          <button type="submit" className="add-submit-btn">심기</button>
        </form>

        <div className="todo-list-container">
          {todos.map((todo) => (
            <div key={todo._id} className={`list-item ${todo.completed ? 'is-done' : ''}`}>
              <div className="apple-status-icon" onClick={() => toggleTodo(todo._id, todo.completed)}>
                {todo.completed ? '🍎' : '🍏'}
              </div>
              <div className="item-body">
                <div className="item-title">{todo.title}</div>
                <div className="item-meta">
                  [ {todo.date || '날짜 없음'} | {todo.completed ? '잘 익은 사과' : '덜 익은 사과'} ]
                </div>
              </div>
              <div className="item-right-actions">
                <button className="delete-tag" onClick={() => deleteTodo(todo._id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>

        <div className="basket-section">
          <div className="apple-basket">
            <div className="basket-body">
              {harvestedApples.length > 0 ? (
                harvestedApples.map((_, i) => <span key={i} className="basket-apple">🍎</span>)
              ) : (
                <span className="empty-msg">바구니가 비어있어요 🧺</span>
              )}
            </div>
          </div>
          <div className="harvest-text">오늘도 잘 익은 사과를 하나씩 수확해봐요 !</div>
        </div>
      </div>
    </div>
  );
}

export default App;