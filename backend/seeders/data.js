'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Data User untuk simulasi peminjaman
    // Kita buat satu user dengan ID 1 agar bisa digunakan di Postman x-user-id: 1
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Mahasiswa',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Admin',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // 2. Data Buku awal (Katalog)
    await queryInterface.bulkInsert('Books', [
      {
        id: 1,
        title: 'Pemrograman Web dengan Node.js',
        author: 'Ir. Asroni, S.T, M.Eng',
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Mastering Sequelize ORM',
        author: 'Dede MK',
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: 'Desain Sistem IoT',
        author: 'Teknologi Informasi UMY',
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus semua data saat melakukan undo seeder
    await queryInterface.bulkDelete('Books', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};