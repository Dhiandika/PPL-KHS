Maaf, saya salah fokus pada contoh sebelumnya. Anda benar, permintaannya adalah untuk memperbaiki laporan pertama, bukan yang kedua.

Berikut perbaikan untuk laporan pertama, dengan perubahan yang kita diskusikan:

# Laporan Pengujian Beban Locust

Laporan ini merangkum hasil pengujian beban yang dilakukan menggunakan Locust pada tanggal 20 November 2024 terhadap aplikasi yang dihosting di `https://hitung-khs.d2azfjqdvvtxog.amplifyapp.com`.  Pengujian ini menggunakan skrip `website_load_test.py` dan berlangsung selama 5 menit.

## Hasil Pengujian

**Statistik Permintaan**

* Jumlah Total Permintaan: 9,330 permintaan dalam waktu 1 menit.

**Tingkat Kegagalan**

* Endpoint `/dev`: 93.03% kegagalan dari 775 permintaan.
* Endpoint `/dev/mahasiswaipk`: 94.37% kegagalan dari 746 permintaan.
* Endpoint `/dev/matakuliah`: 94.29% kegagalan dari 806 permintaan.
* Endpoint `/dev?nim=[angka]`: 89.71% kegagalan dari 1,516 permintaan.  _(Contoh:  `/dev?nim=100001` dan seterusnya)_
* File statis (`/index.html`, `/styles.css`, `/index.js`, dll.): Berhasil diakses tanpa kegagalan.

**Waktu Respons**

* **Rata-rata Waktu Respons:**
    * File Statis: 58 ms
    * Endpoint `/dev/mahasiswaipk`: 789 ms.
* **Waktu Respons Maksimum:** 13.448 ms (beberapa permintaan pada `/dev/mahasiswaipk`), menunjukkan kemungkinan *bottleneck* di server.  Beberapa endpoint mengalami waktu respons yang sangat lambat, mencapai belasan detik.


**Ringkasan Performa Berdasarkan Persentil (untuk setiap endpoint)**

Karena data persentil tidak tersedia pada laporan HTML pertama, tabel ini tidak dapat diisi.  Sangat disarankan untuk menyertakan data persentil (misalnya, p50, p95, p99) pada laporan pengujian di masa mendatang untuk analisis yang lebih komprehensif.


## Simpulan

Tingkat kegagalan yang sangat tinggi (di atas 90%) pada endpoint  API  menunjukkan  masalah  krusial  di  server  yang  perlu  segera  ditangani.  Server  mungkin  *overload*,  kekurangan  *resource*, atau  terdapat  *bug*  pada  aplikasi.  Meskipun  file  statis  berkinerja  baik,  performa  API  yang  buruk  menjadi  perhatian  utama  dan  dapat  berdampak  serius  pada *usability* aplikasi.  Waktu respons maksimum 13.448 ms pada `/dev/mahasiswaipk` dan laporan waktu respons belasan detik pada endpoint lain mengindikasikan adanya *bottleneck*.
