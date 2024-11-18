# Pengujian Performa Situs dan API

## Deskripsi Skenario Pengujian

Pengujian ini dilakukan untuk mengevaluasi kinerja situs dan API terkait di bawah beban pengguna simulasi dengan menggunakan tool **Locust**. 

### Skenario Pengujian
1. **Akses ke halaman utama.**  
2. **Akses ke halaman terkait IPK.**  
3. **Akses ke halaman mata kuliah.**  
4. **Pengujian endpoint API spesifik dengan parameter NIM.**

### Tujuan Pengujian
- Mengidentifikasi tingkat kegagalan.  
- Mengukur waktu respons.  
- Mendeteksi potensi **bottleneck** yang memengaruhi kinerja sistem selama **satu menit pengujian beban**.  

---

## Hasil Pengujian

### Statistik Permintaan
- **Jumlah Total Permintaan**: **9,330 permintaan** dalam waktu 1 menit.

### Tingkat Kegagalan
- **Endpoint /dev**: 93.03% kegagalan dari 775 permintaan.  
- **Endpoint /dev/mahasiswaipk**: 94.37% kegagalan dari 746 permintaan.  
- **Endpoint /dev/matakuliah**: 94.29% kegagalan dari 806 permintaan.  
- **Endpoint /dev?nim=100001**: 89.71% kegagalan dari 1,516 permintaan.  
- **File statis** (`/index.html`, `/styles.css`, `/index.js`, dll.): **Berhasil diakses tanpa kegagalan.**  

### Waktu Respons
- **Rata-rata Waktu Respons**:  
  - **File Statis**: 58 ms.  
  - **Endpoint /dev/mahasiswaipk**: 789 ms.  
- **Waktu Respons Maksimum**: Hingga 13,448 ms untuk beberapa permintaan pada **/dev/mahasiswaipk**, menunjukkan adanya kemungkinan **bottleneck** di server.  

---

## Simpulan

1. **Tingkat kegagalan tinggi (>90%)** pada beberapa endpoint API menunjukkan bahwa server mungkin mengalami kelebihan beban atau terdapat batasan pada sumber daya saat melayani permintaan.  
2. **Respons lambat** pada beberapa endpoint API dengan waktu respons yang mencapai belasan detik mengindikasikan potensi **bottleneck** atau masalah performa pada server.  
3. **File statis** berhasil diakses tanpa kegagalan, menunjukkan bahwa server dapat melayani konten statis dengan baik.  

-
