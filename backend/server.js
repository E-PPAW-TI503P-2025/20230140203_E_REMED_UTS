const express = require('express');
const path = require('path');
const { sequelize } = require('./models'); // Menghubungkan ke folder models
const apiRoutes = require('./routes/apiRoutes'); // Menghubungkan ke file routes yang kita buat

const app = express();
const PORT = 3000;

// 1. Middleware Global
app.use(express.json()); // Supaya bisa baca req.body format JSON
app.use(express.urlencoded({ extended: true })); // Supaya bisa baca form-data

// 2. Serve Static Files (Untuk Tampilan Website)
// Letakkan file index.html kamu di dalam folder bernama 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// 3. Routing
app.use('/api', apiRoutes); // Semua route API akan diawali dengan /api

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 4. Koneksi Database dan Menjalankan Server
sequelize.authenticate()
    .then(() => {
        console.log('✅ Koneksi database berhasil.');
        // Sinkronisasi model ke database (opsional: force: false agar data tidak hilang tiap restart)
        return sequelize.sync({ force: false });
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Tidak dapat terhubung ke database:', err);
    });
