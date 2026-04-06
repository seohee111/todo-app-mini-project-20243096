const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB 연결 (환경 변수 우선 사용)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apple-farm';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 2. 스키마 설정
const todoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  date: { type: String, default: "" }
});

const Todo = mongoose.model('Todo', todoSchema);

// 3. API 라우트
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title, date } = req.body;
  const newTodo = new Todo({ title, date });
  await newTodo.save();
  res.json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { completed } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { completed }, { new: true });
  res.json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// 4. 로컬 실행용 (Vercel 환경이 아닐 때만 실행)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 서버 가동 중: ${PORT}`));
}

// ✨ Vercel 배포를 위해 필수!
module.exports = app;