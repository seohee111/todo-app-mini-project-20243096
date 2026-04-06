import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  // 기본 날짜를 오늘 날짜로 설정
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  // 1. [로딩] 앱이 처음 켜질 때 브라우저 저장소(localStorage)에서 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('apple-farm-todos');
    if (savedData) {
      setTodos(JSON.parse(savedData));
    }
  }, []);

  // 2. [저장] 사과 목록(todos)이 바뀔 때마다 브라우저 저장소에 자동 저장
  useEffect(() => {
    localStorage.setItem('apple-farm-todos', JSON.stringify(todos));
  }, [todos]);

  // 3. [추가] 새로운 사과 심기
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newItem = {
      _id: Date.now().toString(), // 고유 ID 생성
      title: newTodo,
      date: dueDate,
      completed: false
    };

    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  // 4. [토글] 사과 수확하기 (🍏 <-> 🍎)
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 5. [삭제] 사과 제거하기
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo._id !== id));
  };

  // 수확 완료된 사과들 필터링
  const harvestedApples = todos.filter(t => t.completed);

  return (
    <div className="app-wrapper">
      <div className="main-container">
        
        {/* 상단 통계 숫자 박스 */}
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

        {/* 헤더: 타이틀과 날짜 선택기 */}
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

        {/* 입력 영역 */}
        <form onSubmit={addTodo} className="input-group">
          <input 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="어떤 사과가 나올까요?..." 
          />
          <button type="submit" className="add-submit-btn">심기</button>
        </form>

        {/* 리스트 영역 */}
        <div className="todo-list-container">
          {todos.map((todo) => (
            <div key={todo._id} className={`list-item ${todo.completed ? 'is-done' : ''}`}>
              <div className="apple-status-icon" onClick={() => toggleTodo(todo._id)}>
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

        {/* 하단 사과 바구니 섹션 */}
        <div className="basket-section">
          <div className="apple-basket">
            <div className="basket-body">
              {harvestedApples.length > 0 ? (
                harvestedApples.map((_, i) => (
                  <span key={i} className="basket-apple">🍎</span>
                ))
              ) : (
                <span className="empty-msg">바구니가 비어있어요 🧺</span>
              )}
            </div>
          </div>
          <div className="harvest-text">
            오늘도 잘 익은 사과를 하나씩 수확해봐요 !
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;