from locust import HttpUser, task, between, LoadTestShape

class WebsiteUser(HttpUser):
    host = "https://hitung-khs.d2azfjqdvvtxog.amplifyapp.com"  # Ganti dengan host website Anda
    wait_time = between(1, 10)  # Waktu tunggu antara 1 sampai 10 detik

    @task
    def index_page(self):
        self.client.get("/index.html", timeout=10)  # Timeout 10 detik
        self.client.get("/styles.css", timeout=10)  # Timeout 10 detik
        self.client.get("/index.js", timeout=10)  # Timeout 10 detik
        self.client.get("https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev", timeout=120)  # Timeout 120 detik

    @task
    def lihat_ipk_page(self):
        self.client.get("/lihat-ipk.html", timeout=10)  # Timeout 10 detik
        self.client.get("/styles.css", timeout=10)  # Timeout 10 detik
        self.client.get("https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev/mahasiswaipk", timeout=120)  # Timeout 120 detik

    @task
    def matkul_page(self):
        self.client.get("/matkul.html", timeout=10)  # Timeout 10 detik
        self.client.get("/styles.css", timeout=10)  # Timeout 10 detik
        self.client.get("https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev/matakuliah", timeout=120)  # Timeout 120 detik

    @task
    def kalkulator_ips(self):
        nim = "100001"  # Ganti dengan NIM yang valid atau generate secara dinamis
        self.client.get(f"https://c37re7ai77.execute-api.ap-southeast-1.amazonaws.com/dev?nim={nim}", timeout=60)  # Timeout 60 detik

    @task
    def kalkulator_ipk(self):
        nim = "100001"  # Ganti dengan NIM yang valid atau generate secara dinamis
        self.client.get(f"https://7mqhxj5b46.execute-api.ap-southeast-1.amazonaws.com/dev?nim={nim}", timeout=60)  # Timeout 60 detik

class StepLoadShape(LoadTestShape):
    step_time = 10  # Waktu setiap langkah dalam detik
    step_load = 100  # Tambahan jumlah pengguna di setiap langkah
    spawn_rate = 100  # Laju peningkatan pengguna per detik
    time_limit = 60  # Total durasi pengujian dalam detik

    def tick(self):
        run_time = self.get_run_time()

        if run_time < self.time_limit:
            current_step = run_time // self.step_time + 1
            user_count = current_step * self.step_load
            return (user_count, self.spawn_rate)
        else:
            return None
