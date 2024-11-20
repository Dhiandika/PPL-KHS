from locust import HttpUser, task, between, LoadTestShape
import random

class WebsiteUser(HttpUser):
    # Host website yang akan diuji
    host = "https://hitung-khs.d2azfjqdvvtxog.amplifyapp.com"
    
    # Waktu tunggu antara setiap permintaan
    wait_time = between(1, 10)
    
    @task
    def index_page(self):
        """Memuat halaman utama."""
        self.client.get("/index.html", timeout=10)  # Timeout 10 detik
        self.client.get("/styles.css", timeout=10)
        self.client.get("/index.js", timeout=10)
        self.client.get("https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev", timeout=120)  # Timeout 120 detik

    @task
    def lihat_ipk_page(self):
        """Memuat halaman lihat IPK."""
        self.client.get("/lihat-ipk.html", timeout=10)
        self.client.get("/styles.css", timeout=10)
        self.client.get("https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev/mahasiswaipk", timeout=120)

    @task
    def matkul_page(self):
        """Memuat halaman mata kuliah."""
        self.client.get("/matkul.html", timeout=10)
        self.client.get("/styles.css", timeout=10)
        self.client.get("https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev/matakuliah", timeout=120)

    @task
    def kalkulator_ips(self):
        """Menghitung IPS untuk NIM tertentu."""
        nim = str(random.randint(100001, 100100))  # Generate NIM secara dinamis
        self.client.get(f"https://c37re7ai77.execute-api.ap-southeast-1.amazonaws.com/dev?nim={nim}", timeout=60)

    @task
    def kalkulator_ipk(self):
        """Menghitung IPK untuk NIM tertentu."""
        nim = str(random.randint(100001, 100100))  # Generate NIM secara dinamis
        self.client.get(f"https://7mqhxj5b46.execute-api.ap-southeast-1.amazonaws.com/dev?nim={nim}", timeout=60)

class StepLoadShape(LoadTestShape):
    """Mengatur bentuk beban pengujian dengan langkah tertentu."""
    step_time = 10  # Waktu setiap langkah dalam detik
    step_load = 100  # Jumlah pengguna yang ditambahkan di setiap langkah
    spawn_rate = 100  # Laju peningkatan pengguna per detik
    time_limit = 300  # Total durasi pengujian dalam detik (5 menit)
    
    def tick(self):
        """Menghitung jumlah pengguna berdasarkan waktu yang telah berjalan."""
        run_time = self.get_run_time()
        
        if run_time < self.time_limit:
            # Hitung langkah saat ini
            current_step = int(run_time // self.step_time) + 1
            user_count = current_step * self.step_load
            return user_count, self.spawn_rate
        else:
            return None
