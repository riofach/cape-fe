# CAPE Frontend

Aplikasi web frontend untuk **CAPE (Catatan Pengeluaran & Pembayaran)**. Dibangun dengan React, TypeScript, Vite, shadcn-ui, dan Tailwind CSS. Terintegrasi penuh dengan backend CAPE untuk manajemen keuangan, pembayaran, dan support user.

---

## ✨ Fitur Utama

- **Dashboard**: Ringkasan keuangan, notifikasi, dan info status akun
- **Expenses**: CRUD pengeluaran, filter, pencarian, pagination
- **Income**: CRUD pemasukan, filter, pencarian, pagination
- **Payment History**: Riwayat pembayaran, upload bukti, filter status, pagination
- **Support**: Kirim & lihat riwayat bantuan, filter status, pagination
- **Authentication**: Register, login, JWT, sinkronisasi role user
- **Admin Panel**: Manajemen user, verifikasi pembayaran, kelola support (khusus admin)
- **UI/UX Modern**: Komponen konsisten, responsif, dark mode ready

---

## 📁 Struktur Folder

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Komponen UI reusable (shadcn-ui, custom)
│   ├── pages/        # Halaman utama (Dashboard, Expenses, Income, History, Admin, dsb)
│   ├── utils/        # Helper, API request, hooks custom
│   ├── layout/       # Layout utama (DashboardLayout, MainLayout)
│   └── ...           # File konfigurasi, style, dsb
├── package.json      # Daftar dependensi
├── tailwind.config.ts# Konfigurasi Tailwind
├── vite.config.ts    # Konfigurasi Vite
└── README.md         # Dokumentasi ini
```

---

## 🚀 Cara Instalasi & Menjalankan

1. **Clone repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependensi**
   ```sh
   npm install
   ```
3. **Buat file environment (opsional)**
   - Jika perlu, buat `.env` untuk konfigurasi API URL, dsb
4. **Jalankan development server**
   ```sh
   npm run dev
   ```
5. **Build untuk production**
   ```sh
   npm run build
   npm run preview
   ```

---

## 🔗 Integrasi Backend

- Pastikan backend CAPE sudah berjalan (lihat dokumentasi backend)
- Default API URL: `http://localhost:5000/api` (bisa diubah di utils/api.ts atau .env)
- Semua fitur (expenses, income, payment, support, auth) terhubung ke backend via REST API

---

## 🛠️ Dependensi Utama

- [Vite](https://vitejs.dev/) (build tool)
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/) (UI components)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS)
- [date-fns](https://date-fns.org/) (format tanggal)
- [lucide-react](https://lucide.dev/) (icon)

---

## 🧑‍💻 Panduan Kontribusi

- Gunakan branch feature/bugfix untuk perubahan besar
- Pastikan code clean, gunakan komponen reusable jika memungkinkan
- Ikuti style guide (Prettier, ESLint, dsb)
- Tambahkan komentar pada bagian penting/kompleks
- Buat Pull Request (PR) ke branch utama, sertakan deskripsi jelas
- Jalankan testing sebelum merge (jika ada)

---

## 💡 Best Practice

- Komponen UI reusable, hindari duplikasi kode
- State management sederhana (useState, useEffect, custom hooks)
- Error handling di setiap API call
- Loading & empty state selalu ditangani
- Responsive & mobile friendly
- Semua fitur baru sebaiknya didokumentasikan di README

---

## 📚 Dokumentasi Lanjutan

- [Dokumentasi Backend CAPE](../backend/README.md) (lihat endpoint, autentikasi, dsb)

---

## 👥 Credit & Kontak

- Project ini dikembangkan oleh tim CAPE
- Untuk kontribusi, pertanyaan, atau bug report silakan buat issue di GitHub repo ini

---

**Catatan:**
Frontend sudah siap untuk integrasi production dengan backend CAPE terbaru (support filter status & pagination, UI konsisten, maintainable, scalable)
