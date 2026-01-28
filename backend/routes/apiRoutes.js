const express = require('express');
const router = express.Router();

// Import Middleware
const { verifyAdmin, verifyUser } = require('../middlewares/authMiddlewares');

// Import Controllers
const borrowController = require('../controllers/borrowController');
const { Book } = require('../models');

// ==========================================
// 1. PUBLIC ROUTES (Bisa diakses siapa saja)
// ==========================================
router.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

router.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json(book);
});

// ==========================================
// 2. ADMIN ROUTES (Wajib x-user-role: admin)
// ==========================================
router.post('/books', verifyAdmin, async (req, res) => {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
});

router.put('/books/:id', verifyAdmin, async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    await book.update(req.body);
    res.json({ message: "Buku diupdate", data: book });
});

router.delete('/books/:id', verifyAdmin, async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    await book.destroy();
    res.json({ message: "Buku dihapus" });
});

// ==========================================
// 3. USER ROUTES (Wajib x-user-role: user)
// ==========================================
router.post('/borrow', verifyUser, borrowController.borrowBook);

module.exports = router;