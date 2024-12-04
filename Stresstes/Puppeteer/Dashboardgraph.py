import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Baca file CSV hasil pengujian
data = pd.read_csv("perfect_stress_test_results.csv")

# Pastikan kolom 'Error' memiliki nilai default 'No' jika kosong
data['Error'] = data['Error'].fillna('No')

# Tambahkan NIM yang tidak memiliki waktu namun terdaftar sebagai error
all_nim = np.arange(data['NIM'].min(), data['NIM'].max() + 1)
missing_nim = np.setdiff1d(all_nim, data['NIM'])

# Asumsikan semua NIM yang hilang adalah error
missing_data = pd.DataFrame({
    'NIM': missing_nim,
    'Time': [0] * len(missing_nim),
    'Error': ['Yes'] * len(missing_nim)
})

# Gabungkan data asli dengan data yang hilang
data = pd.concat([data, missing_data], ignore_index=True)

# Pisahkan data yang error dan tidak error
error_data = data[data['Error'] == 'Yes']
success_data = data[data['Error'] == 'No']

# Plot grafik
plt.figure(figsize=(12, 6))

# Plot data sukses dengan warna biru
plt.scatter(success_data['NIM'], success_data['Time'], color='blue', label='Sukses', alpha=0.7)

# Plot data error dengan warna merah
plt.scatter(error_data['NIM'], error_data['Time'], color='red', label='Error', alpha=0.7)

# Tambahkan label dan judul
plt.title('Hasil Load Testing Puppeteer', fontsize=16)
plt.xlabel('NIM', fontsize=14)
plt.ylabel('Waktu (ms)', fontsize=14)
plt.legend()

# Tampilkan grafik
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
