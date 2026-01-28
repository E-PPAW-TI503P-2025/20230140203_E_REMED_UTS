const { BorrowLog, Book, User } = require('../models');

exports.borrowBook = async (req, res) => {
    try {
        const { bookId, latitude, longitude } = req.body;
        const userId = req.userContext.id; // Diambil dari middleware verifyUser

        // 1. Validasi Input
        if (!bookId || !latitude || !longitude) {
            return res.status(400).json({ message: "Data tidak lengkap (bookId, lat, long wajib ada)" });
        }

        // 2. Cek apakah Buku ada dan Stok tersedia
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ message: "Buku tidak ditemukan" });
        }

        if (book.stock <= 0) {
            return res.status(400).json({ message: "Stok buku habis, tidak bisa meminjam" });
        }

        // 3. Cek apakah User ada di database (Karena kita pakai tabel User)
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan di sistem" });
        }

        // 4. Proses Peminjaman (Pengurangan stok & Catat Log)
        // Kita gunakan update stok
        await book.update({ stock: book.stock - 1 });

        const log = await BorrowLog.create({
            userId,
            bookId,
            latitude,
            longitude,
            borrowDate: new Date()
        });

        res.status(201).json({
            message: "Peminjaman berhasil dicatat!",
            data: log
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};