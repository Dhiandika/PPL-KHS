const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Gunakan false untuk melihat interaksi
  const page = await browser.newPage();

  // Fungsi untuk menguji IPS dan IPK untuk satu NIM
  const testNim = async (nim) => {
    console.log("\n[TEST] NIM yang dimasukkan: ${nim}");

    // Waktu mulai untuk NIM ini
    const startNimTime = performance.now();

    try {
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
      console.log(
        `Total waktu untuk NIM ${nim}: ${Math.round(endNimTime - startNimTime)} ms`
      );

      return endNimTime - startNimTime;
    } catch (error) {
      console.error(`[ERROR] Pengujian NIM ${nim} gagal:`, error.message);
      return null;
    }
  };

  // Fungsi untuk menguji Search Input
  const testSearch = async (nim) => {
    console.log(`\n[TEST] Search NIM yang dimasukkan: ${nim}`);

    // Waktu mulai untuk pencarian ini
    const startSearchTime = performance.now();

    try {
      // Ketikkan NIM di search input
      await page.type("#searchInput", nim);

      // Tunggu hasil pencarian muncul di tabel
      await page.waitForSelector("#dataTable", { visible: true });

      const searchResult = await page.evaluate(() => {
        const row = document.querySelector("#dataTable tbody tr:nth-child(2)"); // Baris kedua
        if (row) {
          const columns = row.querySelectorAll("td");
          return {
            nim: columns[0].textContent,
            nama: columns[1].textContent,
            ips: columns[2].textContent,
            ipk: columns[3].textContent,
          };
        }
        return null;
      });

      const endSearchTime = performance.now();
      console.log("Search Result:", searchResult);
      console.log("Waktu untuk Search:", Math.round(endSearchTime - startSearchTime), "ms");

      return endSearchTime - startSearchTime;
    } catch (error) {
      console.error(`[ERROR] Pengujian Search NIM ${nim} gagal:`, error.message);
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

      // Pengujian untuk IPS dan IPK
      const nimTime = await testNim(nim);

      // Pengujian untuk Search Input
      const searchTime = await testSearch(nim);

      if (nimTime !== null && searchTime !== null) {
        totalTime += nimTime + searchTime;
        successfulTests.push(nimTime + searchTime);
      }

      // Bersihkan input untuk NIM berikutnya
      await page.evaluate(() => {
        document.getElementById("nim-ips").value = "";
        document.getElementById("nim-ipk").value = "";
        document.getElementById("searchInput").value = "";
      });
    }

    // Hitung rata-rata waktu
    const averageTime =
      successfulTests.length > 0
        ? Math.round(totalTime / successfulTests.length)
        : 0;

    console.log("\n=== RINGKASAN PENGUJIAN ===");
    console.log(`Total waktu untuk 300 NIM: ${Math.round(totalTime)} ms`);
    console.log(`Rata-rata waktu per NIM: ${averageTime} ms`);
  } catch (error) {
    console.error("[ERROR] Terjadi kesalahan saat pengujian:", error.message);
  } finally {
    await browser.close();
  }
})();