const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FOODS_FILE = path.join(__dirname, '../data/foods.json');

// โหลดข้อมูลอาหาร
const loadFoods = () => {
    try {
        const data = fs.readFileSync(FOODS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading foods:', error);
        return [];
    }
};

// GET /api/foods
router.get('/', (req, res) => {
    let foods = loadFoods();
    const { search, category, maxSpicy, vegetarian, available, maxPrice } = req.query;

    if (search) {
        const term = search.toLowerCase();
        foods = foods.filter(f => 
            f.name.toLowerCase().includes(term) ||
            (f.description && f.description.toLowerCase().includes(term))
        );
    }
    if (category) foods = foods.filter(f => f.category === category);
    if (maxSpicy) foods = foods.filter(f => f.spicyLevel <= parseInt(maxSpicy));
    if (vegetarian === 'true') foods = foods.filter(f => f.vegetarian === true);
    if (available === 'true') foods = foods.filter(f => f.available === true);
    if (maxPrice) foods = foods.filter(f => f.price <= parseFloat(maxPrice));

    res.json({ success: true, data: foods, total: foods.length });
});

// GET /api/foods/:id
router.get('/:id', (req, res) => {
    const foods = loadFoods();
    const id = parseInt(req.params.id);
    const food = foods.find(f => f.id === id);
    if (food) res.json({ success: true, data: food });
    else res.status(404).json({ success: false, message: `Food with id=${id} not found` });
});

// GET /api/foods/category/:category
router.get('/category/:category', (req, res) => {
    const foods = loadFoods();
    const category = req.params.category;
    const filtered = foods.filter(f => f.category === category);
    if (filtered.length > 0) res.json({ success: true, data: filtered, total: filtered.length });
    else res.status(404).json({ success: false, message: `No foods found in category: ${category}` });
});

// GET /api/foods/random
router.get('/random', (req, res) => {
    const foods = loadFoods();
    if (foods.length === 0) return res.status(404).json({ success: false, message: 'No foods available' });
    const randomIndex = Math.floor(Math.random() * foods.length);
    res.json({ success: true, data: foods[randomIndex] });
});

module.exports = { router, loadFoods };
