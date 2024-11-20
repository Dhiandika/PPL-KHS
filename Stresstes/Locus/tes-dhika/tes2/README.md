# **Laporan Pengujian Kinerja API dengan Locust**

Pengujian ini dilakukan untuk mengevaluasi kinerja API pada aplikasi *Hitung KHS*. Tujuan utama pengujian adalah memastikan API dapat menangani jumlah pengguna yang tinggi secara efektif, dengan waktu respons yang optimal dan tingkat kegagalan yang minimal.

---

## **Skenario Pengujian**
Pengujian dilakukan untuk mengukur:
1. Waktu respons rata-rata dari setiap endpoint API.
2. Kapasitas sistem dalam menangani jumlah pengguna simultan yang meningkat.
3. Keandalan API terhadap permintaan dalam waktu tertentu.

---

## **Lingkup Pengujian**
API yang diuji:
- **Homepage**:
  - Endpoint: `/index.html`
  - Mengukur kecepatan akses halaman utama dan sumber daya terkait (CSS, JS).
- **Lihat IPK**:
  - Endpoint: `/lihat-ipk.html`
  - Menguji responsibilitas API pengambilan data IPK mahasiswa.
- **Daftar Mata Kuliah**:
  - Endpoint: `/matkul.html`
  - Verifikasi kecepatan akses halaman dan API daftar mata kuliah.
- **Kalkulator IPS**:
  - Endpoint: `https://c37re7ai77.execute-api.ap-southeast-1.amazonaws.com/dev`
  - Menguji perhitungan IPS mahasiswa berdasarkan NIM.
- **Kalkulator IPK**:
  - Endpoint: `https://7mqhxj5b46.execute-api.ap-southeast-1.amazonaws.com/dev`
  - Menguji perhitungan IPK kumulatif mahasiswa berdasarkan NIM.

---

## **Langkah Pengujian**
1. **Persiapan**:
   - Instal Locust dan buat file pengujian (`locustfile.py`).
   - Pastikan API dapat diakses.
2. **Pengujian**:
   - Jalankan Locust menggunakan perintah:
     ```bash
     locust
     ```
   - Masukkan parameter pengujian:
     - Jumlah pengguna awal: 10
     - Tingkat pertumbuhan: 10 pengguna per detik
     - Durasi pengujian: 5 menit
3. **Pemantauan**:
   - Periksa waktu respons rata-rata, jumlah permintaan per detik (RPS), dan tingkat kegagalan di antarmuka Locust.
4. **Analisis**:
   - Catat endpoint dengan waktu respons tertinggi atau tingkat kegagalan terbesar.

---

## **Hasil Pengujian**
Pengujian dilakukan dengan 100 pengguna simultan selama 5 menit. Berikut adalah hasilnya:

| **Endpoint**              | **Rata-rata Waktu Respons (ms)** | **RPS** | **Sukses (%)** | **Gagal (%)** |
|---------------------------|----------------------------------|---------|----------------|---------------|
| `/index.html`             |                             |       | %           | %            |
| `/lihat-ipk.html`         |                             |        | %           | %            |
| `/matkul.html`            |                             |        | %           | %            |
| `kalkulator IPS`          |                            |        | %            | %            |
| `kalkulator IPK`          |                            |       | %            | %           |

---

## **Kesimpulan**
