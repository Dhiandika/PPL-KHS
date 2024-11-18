let allData = []; // Variable to store all data globally

// Fetch Mahasiswa Data and Populate Table
async function fetchDataMahasiswa(rowsPerPage = 25, currentPage = 1) {
    const apiUrl = "https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev";
    const statusDiv = document.getElementById("status");
    const dataTable = document.getElementById("dataTable");
    const tableBody = dataTable.querySelector("tbody");
    const nimIpsSelect = document.getElementById("nim-ips");
    const nimIpkSelect = document.getElementById("nim-ipk");

    try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.statusCode === 200) {
            allData = JSON.parse(result.body); // Store all data globally

            // Apply filtering if search input is present
            const searchInput = document.getElementById("searchInput").value.toLowerCase();
            const filteredData = filterData(searchInput);

            // Calculate pagination
            const totalRows = filteredData.length;
            const totalPages = Math.ceil(totalRows / rowsPerPage);
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const currentData = filteredData.slice(startIndex, endIndex);

            // Clear previous data
            tableBody.innerHTML = "";
            nimIpsSelect.innerHTML = '<option value="">-- Pilih NIM --</option>';
            nimIpkSelect.innerHTML = '<option value="">-- Pilih NIM --</option>';

            currentData.forEach((item) => {
                // Populate table with correct fields
                const row = `
          <tr>
            <td>${item.nim}</td>
            <td>${item.nama_mhs}</td>
            <td>${item.ips.toFixed(2)}</td>
            <td>${item.ipk.toFixed(2)}</td>
          </tr>
        `;
                tableBody.innerHTML += row;

                // Populate dropdowns
                const option = `<option value="${item.nim}">${item.nim}</option>`;
                nimIpsSelect.innerHTML += option;
                nimIpkSelect.innerHTML += option;
            });

            // Show table and hide status message
            dataTable.style.display = "";
            statusDiv.style.display = "none";

            // Update pagination info
            updatePaginationInfo(currentPage, totalPages, totalRows);
            generatePaginationControls(currentPage, totalPages);
        } else {
            throw new Error("Failed to fetch data.");
        }
    } catch (error) {
        statusDiv.textContent = "Error loading data.";
        statusDiv.classList.add("error");
    }
}

// Filter data based on search input
function filterData(searchInput) {
    if (!searchInput) {
        return allData; // If no search input, return all data
    }

    return allData.filter(item =>
        item.nim.toLowerCase().includes(searchInput) ||
        item.nama_mhs.toLowerCase().includes(searchInput)
    );
}

// Handle row per page change
function changeRowsPerPage() {
    const rowsPerPage = parseInt(document.getElementById("rowsPerPage").value);
    fetchDataMahasiswa(rowsPerPage, 1); // Reset to first page with new rows per page
}

// Update pagination info (e.g., 1–25 of 100)
function updatePaginationInfo(currentPage, totalPages, totalRows) {
    const startRow = (currentPage - 1) * 25 + 1;
    const endRow = currentPage * 25 > totalRows ? totalRows : currentPage * 25;
    const navigationInfo = document.getElementById("navigationInfo");
    navigationInfo.textContent = `${startRow}–${endRow} of ${totalRows}`;
}

function generatePaginationControls(currentPage, totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Clear previous pagination controls

    const maxVisibleButtons = 5; // Jumlah tombol maksimal yang terlihat
    let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
    let endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

    if (endPage - startPage < maxVisibleButtons - 1) {
        startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
    }

    // Generate "First" button
    if (currentPage > 1) {
        const firstButton = document.createElement("button");
        firstButton.innerHTML = "&laquo;";
        firstButton.onclick = () => fetchDataMahasiswa(25, 1);
        pagination.appendChild(firstButton);
    }

    // Generate "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.onclick = () => fetchDataMahasiswa(25, currentPage - 1);
        pagination.appendChild(prevButton);
    }

    // Generate page number buttons
    for (let page = startPage; page <= endPage; page++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = page;
        pageButton.onclick = () => fetchDataMahasiswa(25, page);
        pageButton.classList.toggle("active", page === currentPage); // Highlight current page
        pagination.appendChild(pageButton);
    }

    // Generate "Next" button
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.onclick = () => fetchDataMahasiswa(25, currentPage + 1);
        pagination.appendChild(nextButton);
    }

    // Generate "Last" button
    if (currentPage < totalPages) {
        const lastButton = document.createElement("button");
        lastButton.innerHTML = "&raquo;";
        lastButton.onclick = () => fetchDataMahasiswa(25, totalPages);
        pagination.appendChild(lastButton);
    }
}




// Fetch IPS
document
    .getElementById("btn-ips")
    .addEventListener("click", async function () {
        const nim = document.getElementById("nim-ips").value;
        const apiUrl = `https://c37re7ai77.execute-api.ap-southeast-1.amazonaws.com/dev?nim=${nim}`;
        const ipsTable = document.getElementById("ipsTable");
        const tableBody = ipsTable.querySelector("tbody");

        if (!nim) {
            alert("Pilih NIM terlebih dahulu.");
            return;
        }

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (response.ok) {
                const data = JSON.parse(result.body);
                tableBody.innerHTML = "";
                data.forEach((item) => {
                    const row = `
                  <tr>
                    <td>${item.semester}</td>
                    <td>${item.tahun}</td>
                    <td>${item.total_nilai}</td>
                    <td>${item.total_sks}</td>
                    <td>${item.ips.toFixed(2)}</td>
                  </tr>
                `;
                    tableBody.innerHTML += row;
                });
                ipsTable.style.display = "";
            }
        } catch (error) {
            alert("Gagal memuat data IPS.");
        }
    });

// Fetch IPK
document
    .getElementById("btn-ipk")
    .addEventListener("click", async function () {
        const nim = document.getElementById("nim-ipk").value;
        const apiUrl = `https://7mqhxj5b46.execute-api.ap-southeast-1.amazonaws.com/dev?nim=${nim}`;
        const ipkTable = document.getElementById("ipkTable");
        const tableBody = ipkTable.querySelector("tbody");

        if (!nim) {
            alert("Pilih NIM terlebih dahulu.");
            return;
        }

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (response.ok) {
                const data = JSON.parse(result.body);
                tableBody.innerHTML = `
                <tr>
                  <td>${data.total_nilai}</td>
                  <td>${data.total_sks}</td>
                  <td>${data.ipk.toFixed(2)}</td>
                </tr>
              `;
                ipkTable.style.display = "";
            }
        } catch (error) {
            alert("Gagal memuat data IPK.");
        }
    });

// Initial load when page is first opened
document.addEventListener("DOMContentLoaded", function () {
    const rowsPerPage = parseInt(document.getElementById("rowsPerPage").value);
    fetchDataMahasiswa(rowsPerPage, 1); // Default to first page and default rows per page

    // Add search input listener
    document.getElementById("searchInput").addEventListener("input", function () {
        const searchInput = this.value.toLowerCase();
        const rowsPerPage = parseInt(document.getElementById("rowsPerPage").value);
        fetchDataMahasiswa(rowsPerPage, 1); // Reload data based on search
    });
});



document.getElementById('loadDataButton').addEventListener('click', () => {
    const rowsPerPage = parseInt(document.getElementById('rowsPerPageIpk')?.value || 25, 10);
    fetchMahasiswaDataipk(rowsPerPage, 1);
});

let allIpkData = [];
let filteredIpkData = [];

async function fetchMahasiswaDataipk(rowsPerPage = 25, currentPage = 1) {
    try {
        const response = await fetch('https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev/mahasiswaipk');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        allIpkData = parsedData.data || [];
        const rataRataIpk = parsedData.rata_rata_ipk || 0;

        // Validasi elemen sebelum manipulasi
        const rataRataIpkElem = document.getElementById('rataRataIpk');
        const mahasiswaTableElem = document.getElementById('mahasiswaTable');
        const errorMessageElem = document.getElementById('errorMessage');

        if (!allIpkData.length) {
            if (errorMessageElem) errorMessageElem.textContent = 'No data available.';
            return;
        }

        if (rataRataIpkElem) rataRataIpkElem.textContent = rataRataIpk.toFixed(2);
        if (mahasiswaTableElem) mahasiswaTableElem.style.display = 'table';

        // Filter data berdasarkan pencarian
        const searchInput = document.getElementById('searchInputIpk')?.value.toLowerCase() || '';
        filteredIpkData = filterIpkData(searchInput);

        // Pagination
        const totalRows = filteredIpkData.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const currentData = filteredIpkData.slice(startIndex, endIndex);

        // Tampilkan data di tabel
        populateIpkTable(currentData);

        // Update kontrol pagination
        updatePaginationControls(currentPage, totalPages, totalRows, rowsPerPage);
    } catch (error) {
        console.error('Error fetching data:', error);

        const errorMessageElem = document.getElementById('errorMessage');
        if (errorMessageElem) errorMessageElem.textContent = `Error fetching data: ${error.message}`;
    }
}

function populateIpkTable(data) {
    const tableBody = document.querySelector('#mahasiswaTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Kosongkan tabel sebelumnya
    data.forEach(mahasiswa => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mahasiswa.nim}</td>
            <td>${mahasiswa.nama}</td>
            <td>${mahasiswa.total_nilai}</td>
            <td>${mahasiswa.total_sks}</td>
            <td>${mahasiswa.ipk.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterIpkData(searchQuery) {
    if (!searchQuery) return allIpkData;
    return allIpkData.filter(mahasiswa =>
        mahasiswa.nim.toLowerCase().includes(searchQuery) ||
        mahasiswa.nama.toLowerCase().includes(searchQuery)
    );
}

function updatePaginationControls(currentPage, totalPages, totalRows, rowsPerPage) {
    const pagination = document.getElementById('paginationIpk');
    if (!pagination) return;

    pagination.innerHTML = '';

    if (currentPage > 1) {
        pagination.innerHTML += `<button onclick="fetchMahasiswaDataipk(${rowsPerPage}, 1)">&laquo;</button>`;
        pagination.innerHTML += `<button onclick="fetchMahasiswaDataipk(${rowsPerPage}, ${currentPage - 1})">Previous</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage ? 'class="active"' : '';
        pagination.innerHTML += `<button ${isActive} onclick="fetchMahasiswaDataipk(${rowsPerPage}, ${i})">${i}</button>`;
    }

    if (currentPage < totalPages) {
        pagination.innerHTML += `<button onclick="fetchMahasiswaDataipk(${rowsPerPage}, ${currentPage + 1})">Next</button>`;
        pagination.innerHTML += `<button onclick="fetchMahasiswaDataipk(${rowsPerPage}, ${totalPages})">&raquo;</button>`;
    }

    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);
    const navigationInfo = document.getElementById('navigationInfoIpk');
    if (navigationInfo) navigationInfo.textContent = `${startRow}–${endRow} of ${totalRows}`;
}

// Event listener pencarian
document.getElementById('searchInputIpk')?.addEventListener('input', () => {
    const rowsPerPage = parseInt(document.getElementById('rowsPerPageIpk')?.value || 25, 10);
    fetchMahasiswaDataipk(rowsPerPage, 1);
});

// Event listener untuk mengubah rows per page
document.getElementById('rowsPerPageIpk')?.addEventListener('change', () => {
    const rowsPerPage = parseInt(document.getElementById('rowsPerPageIpk')?.value || 25, 10);
    fetchMahasiswaDataipk(rowsPerPage, 1);
});

// loadipk