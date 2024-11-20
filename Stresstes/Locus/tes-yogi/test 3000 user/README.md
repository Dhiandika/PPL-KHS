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
    * ~71 detik (`/dev?nim=100042` dan beberapa endpoint lainnya)
    * ~70 detik (`/dev/mahasiswaipk`)

**Ringkasan Performa Berdasarkan Persentil (untuk setiap endpoint)**

| Endpoint             | 50% (median) | 95%        | 99%       | Maksimum |
|----------------------|--------------|------------|-----------|---------|
| `/dev`               | 650 ms       | 1200 ms     | 3100 ms    | 70 detik|
| `/dev/mahasiswaipk` | 640 ms       | 1200 ms     | 16 detik  | 70 detik|
| `/dev/matakuliah`   | 630 ms       | 1200 ms     | 3100 ms    | 70 detik|
| `/dev?nim=[bervariasi]` | ~600 ms     | ~1200 ms   | ~20 detik | ~70 detik|
| File Statis          | ~500 ms      | ~1100 ms   | ~1200 ms |  2 detik|


## Simpulan

* **Kegagalan API:** Tingkat kegagalan yang sangat tinggi pada endpoint API menunjukkan masalah krusial pada server.  Server mungkin overload, kekurangan resource, atau terdapat bug pada aplikasi.
* **Waktu Respons Lambat:** Waktu respons yang lambat dan bervariasi, dengan beberapa mencapai lebih dari 70 detik, mengindikasikan bottleneck atau masalah performa server.
* **Performa File Statis:** Server menangani permintaan file statis dengan lebih baik, meskipun perlu investigasi lebih lanjut terhadap kegagalan  `ConnectionResetError` pada `/styles.css` dan waktu respons yang relatif tinggi pada beberapa file HTML.

