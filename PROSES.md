# PROSES

## 1. Persona dan Permasalahan

Persona aplikasi myRupiah adalah seorang driver ojek online yang memperoleh pendapatan dari aktivitas mengantar penumpang atau pesanan. Pendapatan yang diterima dapat berbeda setiap hari, sementara driver juga perlu mengeluarkan uang untuk kebutuhan operasional, seperti bensin dan perawatan kendaraan, serta kebutuhan pribadi.

Permasalahan yang ingin diselesaikan adalah kesulitan mencatat pemasukan dan pengeluaran secara teratur. Jika transaksi hanya diingat atau dicatat secara terpisah, pengguna dapat kesulitan mengetahui total pemasukan, total pengeluaran, dan saldo yang tersisa.

myRupiah dirancang sebagai aplikasi pencatatan keuangan sederhana agar pengguna dapat memasukkan transaksi, melihat riwayat transaksi, dan mengetahui kondisi keuangannya melalui ringkasan yang mudah dipahami.

## 2. Rancangan Struktur Data

Setiap transaksi disimpan sebagai objek JavaScript dengan atribut berikut:

| Atribut | Tipe Data | Keterangan |
|---|---|---|
| `id` | String | Identitas unik untuk setiap transaksi. |
| `date` | String | Tanggal transaksi dengan format `YYYY-MM-DD`. |
| `type` | String | Jenis transaksi, yaitu `pemasukan` atau `pengeluaran`. |
| `category` | String | Kategori transaksi, seperti Pendapatan Ojol, Bonus, Bensin, atau Tagihan. |
| `amount` | Number | Jumlah uang dalam rupiah. |
| `note` | String | Catatan tambahan yang bersifat opsional. |

Kumpulan transaksi disimpan dalam sebuah array bernama `transactions`. Data tersebut kemudian diubah menjadi format JSON dan disimpan menggunakan `localStorage` dengan kunci `myRupiahTransactions`.

Ketika aplikasi dibuka kembali pada browser yang sama, fungsi `loadTransactions()` membaca data yang tersimpan. Fungsi `renderSummary()` menghitung total pemasukan, total pengeluaran, dan saldo berdasarkan data transaksi tersebut.

Saldo dihitung dengan rumus:

**Saldo = Total Pemasukan − Total Pengeluaran**

## 3. Keputusan Desain dan Alasannya

Salah satu keputusan desain yang diambil adalah memisahkan aplikasi menjadi dua halaman utama, yaitu Ringkasan dan Transaksi, melalui navigasi.

Halaman Ringkasan menampilkan total pemasukan, total pengeluaran, saldo, dan transaksi terbaru. Halaman Transaksi menyediakan formulir untuk memasukkan transaksi serta daftar semua transaksi.

Keputusan ini diambil agar informasi keuangan utama dapat dilihat tanpa harus melewati formulir transaksi terlebih dahulu. Pemisahan halaman juga membuat antarmuka lebih terorganisasi dan mengurangi penumpukan komponen pada satu halaman.

Selain itu, aplikasi menggunakan `localStorage` untuk menyimpan data transaksi. Pendekatan ini dipilih karena proyek merupakan aplikasi sederhana berbasis browser dan belum membutuhkan backend atau basis data server. Namun, data hanya tersedia pada penyimpanan browser yang digunakan dan tidak otomatis tersinkronisasi ke perangkat lain.

## 4. Kendala Teknis dan Penanganannya

### Kendala 1 — Menyesuaikan Tampilan pada Layar Ponsel

Tampilan desktop memiliki ruang yang lebih luas daripada layar ponsel. Jika ukuran elemen tidak disesuaikan, navigasi, kartu ringkasan, dan formulir dapat menjadi terlalu sempit atau menyebabkan halaman melebar secara horizontal.

**Penanganan:** CSS menggunakan media queries pada beberapa ukuran layar, termasuk `760px`, `520px`, dan `390px`. Grid formulir diubah menjadi satu kolom pada layar yang lebih kecil, sementara kartu ringkasan tetap menggunakan dua kolom pada aturan untuk ponsel kecil. Ukuran padding, font, dan komponen juga disesuaikan.

### Kendala 2 — Memastikan Data Transaksi Tetap Tersimpan

Data transaksi perlu tetap tersedia ketika pengguna berpindah halaman atau membuka kembali aplikasi. Menyimpan data hanya dalam variabel JavaScript tidak cukup untuk mempertahankannya setelah halaman dimuat ulang.

**Penanganan:** Aplikasi menggunakan `localStorage` untuk menyimpan data dalam format JSON. Fungsi `loadTransactions()` memuat data yang tersimpan, sedangkan `saveTransactions()` menyimpan perubahan. Penanganan error juga ditambahkan agar aplikasi dapat memberikan notifikasi ketika penyimpanan gagal.

### Kendala 3 — Menjaga Perhitungan Ringkasan Tetap Sesuai dengan Transaksi

Total pemasukan, total pengeluaran, dan saldo harus diperbarui setiap kali transaksi berhasil ditambahkan. Jika ringkasan tidak dirender ulang, angka yang ditampilkan dapat berbeda dari data transaksi.

**Penanganan:** Fungsi `renderApp()` memanggil `renderSummary()` dan memperbarui daftar transaksi setelah penyimpanan berhasil. Formulir juga memvalidasi tanggal, jenis transaksi, kategori, dan jumlah uang sebelum transaksi ditambahkan.

## 5. Kesimpulan

myRupiah dirancang untuk membantu driver ojek online mencatat pemasukan dan pengeluaran secara sederhana. Struktur data transaksi dibuat agar setiap transaksi memiliki identitas, tanggal, jenis, kategori, jumlah, dan catatan. Pemisahan halaman Ringkasan dan Transaksi membantu pengguna mengakses informasi keuangan dengan lebih terorganisasi, sedangkan `localStorage` memungkinkan data tetap tersimpan di browser yang digunakan.

