const express = require('express');
const cors = require('cors');
const path = require('path');

const { router: foodRoutes, loadFoods } = require('./routes/foods');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(logger);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🍜 Welcome to Food API!',
        version: '1.0.0',
        endpoints: {
            foods: '/api/foods',
            search: '/api/foods?search=ผัด',
            category: '/api/foods?category=แกง',
            spicy: '/api/foods?maxSpicy=3',
            vegetarian: '/api/foods?vegetarian=true',
            documentation: '/api/docs'
        }
    });
});

// ใช้ router
app.use('/api/foods', foodRoutes);

// GET /api/docs
app.get('/api/docs', (req, res) => {
    res.json({
        info: 'Food API Documentation',
        endpoints: {
            '/api/foods': 'GET all foods with optional query params',
            '/api/foods/:id': 'GET food by id',
            '/api/foods/category/:category': 'GET foods by category',
            '/api/foods/random': 'GET random food',
            '/api/stats': 'GET statistics'
        }
    });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
    const foods = loadFoods();
    const totalFoods = foods.length;
    const categoriesCount = foods.reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
    }, {});
    res.json({ totalFoods, categoriesCount });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found', requestedUrl: req.originalUrl });
});

app.listen(PORT, () => {
    console.log(`🚀 Food API Server running on http://localhost:${PORT}`);
    console.log(`📖 API Docs: http://localhost:${PORT}/api/docs`);
});
