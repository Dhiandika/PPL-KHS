# Laporan Pengujian Beban

Laporan ini merangkum hasil pengujian beban pada aplikasi yang dihosting di `https://hitung-khs.d2azfjqdvvtxog.amplifyapp.com`, menggunakan skrip Locust `website_load_test.py`. Pengujian dilakukan dengan mensimulasikan hingga 3000 pengguna selama 5 menit dan 2 detik.

## Hasil Pengujian

**Statistik Permintaan**

* **Jumlah Total Permintaan:** 227.784 permintaan
* **Waktu Pengujian:** 5 menit dan 2 detik

**Tingkat Kegagalan**

* **Endpoint /dev:** 92.42% kegagalan (18.765 permintaan)
* **Endpoint /dev/mahasiswaipk:** 93.30% kegagalan (18.898 permintaan)
* **Endpoint /dev/matakuliah:** 93.77% kegagalan (18.956 permintaan)
* **Endpoint /dev?nim=[bervariasi]:** ~90% kegagalan (~3.000 permintaan per NIM)
* **File Statis (e.g., /index.html, /styles.css, /index.js, /lihat-ipk.html, /matkul.html):**  Berhasil diakses (1 kegagalan pada `/styles.css` karena `ConnectionResetError`)

**Waktu Respons**

* **Rata-rata:**
    * File Statis: 470 ms (`/styles.css`) - 1112 ms (`/index.html`)
    * `/dev/mahasiswaipk`: 1044 ms
    * Endpoint lainnya: 500 ms - 700 ms
* **Maksimum:**
    * ~71.000 ms (`/dev?nim=100042` dan beberapa endpoint lainnya)
    * ~70.000 ms (`/dev/mahasiswaipk`)

**Ringkasan Performa Berdasarkan Persentil (untuk setiap endpoint)**

| Endpoint             | Rata-rata | 50% (median) | 95%        | 99%        | Maksimum   |
|----------------------|-----------|--------------|------------|------------|------------|
| `/dev`               | 700 ms    | 650 ms       | 1200 ms     | 3100 ms    | 70.000 ms  |
| `/dev/mahasiswaipk` | 735 ms    | 640 ms       | 1200 ms     | 16.000 ms  | 70.000 ms  |
| `/dev/matakuliah`   | 56 ms     | 630 ms       | 1200 ms     | 3100 ms    | 70.000 ms  |
| `/dev?nim=[bervariasi]` | ~67 ms   | ~600 ms     | ~1200 ms   | ~20.000 ms | ~70.000 ms |
| File Statis          | ~300 ms   | ~500 ms      | ~1100 ms   | ~1200 ms |  2000 ms   |



## Simpulan

Pengujian beban ini mengungkapkan masalah performa signifikan pada endpoint API, ditandai dengan tingkat kegagalan yang ekstrem (lebih dari 90%).  Hal ini menunjukkan adanya masalah serius di server yang perlu segera ditangani.  Meskipun file statis berkinerja relatif baik, performa API yang buruk menjadi perhatian utama dan dapat berdampak serius pada usability aplikasi.
