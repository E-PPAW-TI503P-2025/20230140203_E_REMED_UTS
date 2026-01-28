# 📚 Library System with Geolocation API

---

## 📝 Deskripsi Proyek
Library System with Geolocation API merupakan backend sistem perpustakaan sederhana yang dikembangkan menggunakan **Node.js**, **Express.js**, dan **Sequelize ORM** dengan database **MySQL**.

Aplikasi ini menerapkan simulasi **Role-Based Access Control (RBAC)** menggunakan custom HTTP Header serta pencatatan lokasi peminjaman buku menggunakan **Geolocation (Latitude & Longitude)**.

---

## 🌟 Fitur Utama
- 📘 **Manajemen Buku (Admin)**  
  CRUD data buku (Create, Read, Update, Delete)

- 🔄 **Transaksi Peminjaman (User)**  
  Peminjaman buku dengan validasi stok otomatis

- 🌍 **Geolocation Support**  
  Menyimpan koordinat lokasi peminjaman (Latitude & Longitude)

- 🔐 **Simulasi Hak Akses (RBAC)**  
  Middleware untuk membedakan akses Admin dan User

---

## 🏗️ Struktur Proyek (Clean Architecture)

```text
backend/
├── config/             # Konfigurasi database
├── controllers/        # Logika bisnis
├── frontend/           # html dan js untuk tampilan web
├── middlewares/        # Middleware autentikasi & role
├── migrations/         # Migrasi database
├── models/             # Model Sequelize & relasi tabel
├── routes/             # Routing API
├── server.js.js              # Entry point aplikasi
└── package.json        # Dependencies
```

## 🚀 Instruksi Cara Menjalankan Aplikasi 
1️⃣ Persiapan Database

Pastikan MySQL sudah berjalan, kemudian buat database:
```text
CREATE DATABASE library-system;
```
2️⃣ Konfigurasi Database
Buka file config/config.json di folder proyek, sesuaikan username dan password database MySQL lokal kamu.<br>
3️⃣ Instalasi Dependencies
Buka terminal di dalam folder proyek, lalu jalankan perintah:
```text
Bash
npm install
```

4️⃣ Menjalankan Migrasi
Lakukan migrasi untuk membuat tabel Users, Books, dan BorrowLogs secara otomatis beserta relasinya:

``` text
Bash
npx sequelize-cli db:migrate
```

5️⃣ Jalankan Server
Gunakan perintah berikut untuk memulai aplikasi:
```text
Bash
node server.js
```
Aplikasi akan berjalan di: http://localhost:3000 <br>
<br>
## 📑 Dokumentasi Endpoint API
**A. Fitur Public (Semua Role)**

GET /api/books : Melihat daftar semua buku.

GET /api/books/:id : Melihat detail buku berdasarkan ID.

**B. Fitur Admin (Header x-user-role: admin)**

POST /api/books : Menambah buku baru.

PUT /api/books/:id : Memperbarui data buku.

DELETE /api/books/:id : Menghapus buku.

**C. Fitur User (Header x-user-role: user & x-user-id: [id])**

POST /api/borrow : Meminjam buku + Simpan Geolocation.

## Bukti Hasil Aplikasi (Screenshots)
**1. Struktur Database**
|DATABASE|
|---|
|<img width="1204" height="860" alt="Screenshot 2026-01-29 051210" src="https://github.com/user-attachments/assets/ead1a536-aeb1-4142-b650-15197b808db7" />|

**2. Test Endpoint (Postman)**
#### Admin Mode: (Screenshot Postman dengan header x-user-role: admin)
|tambah buku|edit buku|hapus buku|
|---|---|---|
|<img width="1920" height="1200" alt="Screenshot 2026-01-29 051702" src="https://github.com/user-attachments/assets/4c95b78f-1e54-4031-95c6-edb99d6c15ae" />|<img width="1920" height="1200" alt="Screenshot 2026-01-29 051920" src="https://github.com/user-attachments/assets/c0dec2dd-bb33-4b82-9882-45fedabaef9f" />| <img width="1920" height="1200" alt="Screenshot 2026-01-29 051948" src="https://github.com/user-attachments/assets/285e2c94-df10-4d87-aab2-0bf12d5eb6ba" />

#### User Mode: (Screenshot Postman saat berhasil meminjam buku)
|meminjam buku|
|---|
|<img width="1920" height="1200" alt="Screenshot 2026-01-29 052420" src="https://github.com/user-attachments/assets/6af4cb32-bf93-478c-8825-1a4597b90781" />|
#### Public
|get all buku|detail buku|
|---|---|
|<img width="1920" height="1200" alt="Screenshot 2026-01-29 052615" src="https://github.com/user-attachments/assets/1e3ebdc4-24fb-42a7-abf9-8608f6e3e585" />|<img width="1920" height="1200" alt="Screenshot 2026-01-29 052712" src="https://github.com/user-attachments/assets/56a038e8-f42c-451a-a3fc-03e16f47a38a" />|



**3. Tampilan Web**

https://umyac-my.sharepoint.com/:w:/g/personal/h_nadiva_ft23_mail_umy_ac_id/IQAYUTl50ErGTp667LR1-dvJAReuy3rcLEpEzaTnzG-J7wQ
