const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // 배포 시 .env 파일을 읽기 위해 필요

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB 연결 설정 (환경 변수 MONGODB_URI를 우선 사용)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apple-farm';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 2. 데이터 스키마 설정 (date 필드 추가)
const todoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  date: { type: String, default: "" } // 날짜를 문자열(yyyy-mm-dd)로 저장
});

const Todo = mongoose.model('Todo', todoSchema);

// 3. API 라우트 설정
// 모든 할 일 가져오기
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 할 일 추가하기 (날짜 포함)
app.post('/api/todos', async (req, res) => {
  const { title, date } = req.body;
  const newTodo = new Todo({ title, date });
  await newTodo.save();
  res.json(newTodo);
});

// 할 일 상태 업데이트
app.put('/api/todos/:id', async (req, res) => {
  const { completed } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id, 
    { completed }, 
    { new: true }
  );
  res.json(updatedTodo);
});

// 할 일 삭제
app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// 4. 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 서버가 포트 ${PORT}에서 작동 중!`));