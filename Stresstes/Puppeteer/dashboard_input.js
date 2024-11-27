const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Gunakan false untuk melihat interaksi
  const page = await browser.newPage();

  // Daftar NIM untuk pengujian
  const nims = [
    "100001", "100002", "100003", "100004", "100005",
    "100006", "100007", "100008", "100009", "100010",
    "100011", "100012", "100013", "100014", "100015",
    "100016", "100017", "100018", "100019", "100020",
    "100021", "100022", "100023", "100024", "100025",
    "100026", "100027", "100028", "100029", "100030",
    "100031", "100032", "100033", "100034", "100035",
    "100036", "100037", "100038", "100039", "100040",
    "100041", "100042", "100043", "100044", "100045",
    "100046", "100047", "100048", "100049", "100050",
    "100051", "100052", "100053", "100054", "100055",
    "100056", "100057", "100058", "100059", "100060",
    "100061", "100062", "100063", "100064", "100065",
    "100066", "100067", "100068", "100069", "100070",
    "100071", "100072", "100073", "100074", "100075",
    "100076", "100077", "100078", "100079", "100080",
    "100081", "100082", "100083", "100084", "100085",
    "100086", "100087", "100088", "100089", "100090",
    "100091", "100092", "100093", "100094", "100095",
    "100096", "100097", "100098", "100099", "100100"
  ];
  

  // Fungsi untuk menguji IPS dan IPK untuk satu NIM
  const testNim = async (nim) => {
    console.log(`\n[TEST] NIM yang dimasukkan: ${nim}`);

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

  try {
    // Buka halaman target
    console.log("[INFO] Membuka halaman dashboard...");
    await page.goto("https://hitung-khs.d2azfjqdvvtxog.amplifyapp.com/", {
      waitUntil: "networkidle2",
    });

    let totalTime = 0;
    const successfulTests = [];

    // Uji setiap NIM
    for (const nim of nims) {
      const time = await testNim(nim);
      if (time !== null) {
        totalTime += time;
        successfulTests.push(time);
      }

      // Bersihkan input untuk NIM berikutnya
      await page.evaluate(() => {
        document.getElementById("nim-ips").value = "";
        document.getElementById("nim-ipk").value = "";
      });
    }

    // Hitung rata-rata waktu
    const averageTime =
      successfulTests.length > 0
        ? Math.round(totalTime / successfulTests.length)
        : 0;

    console.log("\n=== RINGKASAN PENGUJIAN ===");
    console.log(`Total waktu untuk 10 NIM: ${Math.round(totalTime)} ms`);
    console.log(`Rata-rata waktu per NIM: ${averageTime} ms`);
  } catch (error) {
    console.error("[ERROR] Terjadi kesalahan saat pengujian:", error.message);
  } finally {
    await browser.close();
  }
})();
