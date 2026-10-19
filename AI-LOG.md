# AI-LOG

## 1. Pembuatan Kode Awal

**Prompt yang dikirim:**

> "make codes for html js and css but just about the obligated functions and not yet the additionals"

**Bagian kode yang digunakan:**
- `index.html`: struktur halaman Ringkasan dan Transaksi.
- `style.css`: styling dasar aplikasi.
- `script.js`: fungsi pencatatan dan perhitungan transaksi.

**Perubahan atau perbaikan:**

Kode awal dijadikan dasar pengembangan myRupiah. Implementasi kemudian disesuaikan dengan kebutuhan aplikasi, yaitu menampilkan ringkasan pemasukan, pengeluaran, dan saldo; menyediakan formulir transaksi; serta menampilkan riwayat transaksi.

## 2. Penyesuaian Desain dan Warna

**Prompt yang dikirim:**

> "from the given, remove the pengelolaan keuangan desc and move the date to the navigation so that it can be seen no matter from which page, make the colors into the new color codes, we dont need sub descriptions and just make it to the name of the feature directly"

**Bagian kode yang digunakan:**
- `index.html`: header, navigasi, tanggal, dan judul halaman.
- `style.css`: warna, navigasi, dan tipografi.

**Perubahan atau perbaikan:**

Deskripsi tambahan dihilangkan agar antarmuka lebih sederhana. Tanggal dipindahkan ke area navigasi supaya tetap terlihat saat pengguna berpindah halaman. Warna dan teks antarmuka disesuaikan dengan pilihan color codes yang baru.

## 3. Penyesuaian Navigasi

**Prompt yang dikirim:**

> "tanggalnya separate it to the most right and make it exactly in the same row with ringkasan and transaksi navs"

**Bagian kode yang digunakan:**
- `index.html`: elemen navigasi dan tanggal.
- `style.css`: layout header dan navbar.

**Perubahan atau perbaikan:**

Navigasi Ringkasan dan Transaksi ditempatkan dalam satu baris, sementara tanggal dipisahkan ke sisi paling kanan. Warna navbar dibuat berbeda dari latar belakang halaman untuk memperjelas pemisahan visual.

## 4. Implementasi Penyimpanan dan Transaksi

**Prompt yang dikirim:**

> "final css and js"

**Bagian kode yang digunakan:**
- `script.js`: penyimpanan transaksi, validasi input, perhitungan ringkasan, perpindahan halaman, dan tampilan daftar transaksi.
- `style.css`: tampilan formulir, kartu ringkasan, daftar transaksi, dan notifikasi.

**Perubahan atau perbaikan:**

Implementasi disesuaikan dengan ID elemen HTML yang digunakan. Data transaksi disimpan menggunakan `localStorage`, sedangkan ringkasan dihitung dari data transaksi yang tersimpan. Validasi ditambahkan untuk memastikan jumlah transaksi lebih dari nol dan tanggal serta kategori telah dipilih.

## 5. Penyesuaian Font dan Responsivitas

`style.css`: font, ketebalan teks, ukuran komponen, dan media queries.

**Perubahan atau perbaikan:**

Ketebalan font pada bagian antarmuka selain logo dikurangi agar lebih ringan. Logo bagianteks "my" dalam ketebalan normal dan "Rupiah" dalam ketebalan bold. Helvetica tetap digunakan untuk bagian antarmuka lainnya. Media queries ditambahkan untuk menyesuaikan tampilan pada layar ponsel, termasuk lebar 360 piksel.

## 6. Evaluasi Hasil AI

AI digunakan sebagai alat bantu dalam proses pengembangan kode dan penyesuaian desain myRupiah. Hasilnya disesuaikan secara bertahap melalui prompt lanjutan dan juga penyesuaian langsung khususnya pada bagian CSS berdasarkan tampilan yang diinginkan. 

