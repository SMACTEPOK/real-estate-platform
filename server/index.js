import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockProperties, cityAnalytics, availableCities } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ УВАГА: JWT_SECRET не знайдено в .env. Використовується небезпечний fallback.');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Невірний email або пароль' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName } });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, displayName } = req.body;
  const db = readDB();
  
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Користувач вже існує' });
  }

  const newUser = { id: 'u' + (db.users.length + 1), email, displayName, password: bcrypt.hashSync(password, 10) };
  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, displayName: newUser.displayName } });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Немає токена' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Недійсний токен' });
  }
}

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'Не знайдено' });
  res.json({ user: { id: user.id, email: user.email, displayName: user.displayName } });
});

// --- PROPERTIES ---
app.get('/api/properties', (req, res) => {
  res.json({ items: mockProperties, total: mockProperties.length });
});

app.get('/api/properties/:id', (req, res) => {
  const property = mockProperties.find((p) => p.id === req.params.id);
  if (!property) return res.status(404).json({ message: 'Не знайдено' });
  res.json(property);
});

// --- ANALYTICS ---
app.get('/api/analytics/cities', (req, res) => {
  res.json({ cities: availableCities });
});

app.get('/api/analytics', (req, res) => {
  const city = req.query.city || availableCities[0];
  const data = cityAnalytics[city];
  if (!data) return res.status(404).json({ message: 'Місто не знайдено' });
  res.json({ city, ...data });
});

app.listen(PORT, () => {
  console.warn(`🚀 Бекенд запущено на http://localhost:${PORT}`);
});
