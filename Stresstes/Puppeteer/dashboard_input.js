const puppeteer = require("puppeteer");
const fs = require('fs'); // Import modul untuk menulis file

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Gunakan false untuk melihat interaksi
  const page = await browser.newPage();

  // Array untuk mencatat NIM dengan error
  const errorNims = [];
  const results = []; // Array untuk menyimpan hasil pengujian
  
  // Tangani dialog (alert) secara otomatis
  page.on("dialog", async (dialog) => {
    console.warn(`[ALERT] Pesan dialog terdeteksi: "${dialog.message()}"`);
    await dialog.accept(); // Tekan tombol "OK" pada dialog
  });

  // Fungsi untuk menguji pencarian data di #searchInput
  const testSearchInput = async (nim) => {
    console.log(`\n[TEST] Pencarian Data Mahasiswa dengan NIM: "${nim}"`);

    const startSearchTime = performance.now();
    try {
      // Bersihkan input sebelum mengetik NIM
      await page.evaluate(() => {
        const input = document.getElementById("searchInput");
        input.value = ""; // Bersihkan input sebelumnya
      });

      // Masukkan input NIM ke #searchInput
      await page.type("#searchInput", nim);

      // Picu event input untuk menjalankan pencarian
      await page.evaluate(() => {
        const input = document.getElementById("searchInput");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });

      // Tunggu hasil tabel diperbarui
      await page.waitForSelector("#dataTable tbody tr", { visible: true });

      const endSearchTime = performance.now();
      console.log(`Waktu untuk pencarian di #searchInput: ${Math.round(endSearchTime - startSearchTime)} ms`);
    } catch (error) {
      console.error(`[ERROR] Pencarian Data Mahasiswa gagal untuk NIM "${nim}":`, error.message);
    }
  };

  // Fungsi untuk menguji IPS dan IPK untuk satu NIM
  const testNim = async (nim) => {
    console.log(`\n[TEST] NIM yang dimasukkan: ${nim}`);

    // Waktu mulai untuk NIM ini
    const startNimTime = performance.now();

    try {
      // Pengujian Pencarian Data Mahasiswa
      const searchStart = performance.now();
      await testSearchInput(nim); // Test pencarian sebelum menuju IPS
      const searchEnd = performance.now();
      console.log(`Waktu total untuk pencarian di #searchInput: ${Math.round(searchEnd - searchStart)} ms`);

      // Proses untuk mendapatkan IPS
      const startIps = performance.now();

      await page.type("#nim-ips", nim);
      await page.click("#btn-ips");

      // Tunggu tabel IPS muncul
      await page.waitForSelector("#ipsTable", { visible: true });

      const ipsResult = await page.evaluate(() => {
        const row = document.querySelector("#ipsTable tbody tr");
        if (row) {
          const columns = row.querySelectorAll("td");
          return {
            semester: columns[0].textContent,
            tahun: columns[1].textContent,
            ips: columns[4].textContent,
          };
        }
        return null;
      });

      const endIps = performance.now();
      console.log("IPS Result:", ipsResult);
      console.log("Waktu untuk IPS:", Math.round(endIps - startIps), "ms");

      // Proses untuk mendapatkan IPK
      const startIpk = performance.now();

      await page.type("#nim-ipk", nim);
      await page.click("#btn-ipk");

      // Tunggu tabel IPK muncul
      await page.waitForSelector("#ipkTable", { visible: true });

      const ipkResult = await page.evaluate(() => {
        const row = document.querySelector("#ipkTable tbody tr");
        if (row) {
          const columns = row.querySelectorAll("td");
          return {
            totalNilai: columns[0].textContent,
            totalSks: columns[1].textContent,
            ipk: columns[2].textContent,
          };
        }
        return null;
      });

      const endIpk = performance.now();
      console.log("IPK Result:", ipkResult);
      console.log("Waktu untuk IPK:", Math.round(endIpk - startIpk), "ms");

      // Total waktu untuk NIM ini
      const endNimTime = performance.now();
      console.log(`Total waktu untuk NIM "${nim}": ${Math.round(endNimTime - startNimTime)} ms`);

      return endNimTime - startNimTime;
    } catch (error) {
      console.error(`[ERROR] Pengujian NIM ${nim} gagal:`, error.message);

      // Mencatat NIM yang gagal saat terjadi error pada IPS atau IPK
      errorNims.push(nim); // Catat NIM yang gagal
      return null;
    }
  };

  try {
    // Buka halaman target
    console.log("[INFO] Membuka halaman dashboard...");
    await page.goto("https://hitung-khs.d2azfjqdvvtxog.amplifyapp.com/", {
      waitUntil: "networkidle2",
    });

    let totalTime = 0;
    const successfulTests = [];

    // Iterasi untuk NIM dari 100001 hingga 100300
    for (let i = 1; i <= 300; i++) {
      const nim = (100000 + i).toString(); // Pastikan NIM tetap dalam format 6 digit
      const time = await testNim(nim);
      if (time !== null) {
        totalTime += time;
        successfulTests.push(time);
        results.push({ nim, time });
      }

      // Bersihkan input untuk NIM berikutnya
      await page.evaluate(() => {
        document.getElementById("nim-ips").value = "";
        document.getElementById("nim-ipk").value = "";
      });
    }
    // Simpan hasil ke file CSV
    fs.writeFileSync(
      'stress_test_results.csv',
      'NIM,Time,Error\n' +
        results
          .map((r) => `${r.nim},${r.time},${errorNims.includes(r.nim) ? 'Yes' : 'No'}`)
          .join('\n')
    );
    console.log('[INFO] Hasil pengujian disimpan ke stress_test_results.csv');

    // Hitung rata-rata waktu
    const averageTime =
      successfulTests.length > 0
        ? Math.round(totalTime / successfulTests.length)
        : 0;
    
    console.log("\n=== RINGKASAN PENGUJIAN ===");
    console.log(`Total waktu untuk 300 NIM: ${Math.round(totalTime)} ms`);
    console.log(`Rata-rata waktu per NIM: ${averageTime} ms`);
    console.log(`Daftar NIM dengan error: ${errorNims.join(", ")}`);
  } catch (error) {
    console.error("[ERROR] Terjadi kesalahan saat pengujian:", error.message);
  } finally {
    await browser.close();
  }
})();
