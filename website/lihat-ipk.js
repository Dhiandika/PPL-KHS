document.getElementById('loadDataButton').addEventListener('click', () => {
    const rowsPerPage = parseInt(document.getElementById('rowsPerPageIpk')?.value || 25, 10);
    fetchMahasiswaDataipk(rowsPerPage, 1);
});

let allIpkData = [];
let filteredIpkData = [];

async function fetchMahasiswaData() {
    try {
        const response = await fetch('https://kx3kq36nak.execute-api.ap-southeast-1.amazonaws.com/dev/mahasiswaipk');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        const mahasiswaData = parsedData.data;
        const rataRataIpk = parsedData.rata_rata_ipk;

        if (!mahasiswaData || mahasiswaData.length === 0) {
            document.getElementById('errorMessage').textContent = 'No data available.';
            return;
        }

        document.getElementById('rataRataIpk').textContent = rataRataIpk;
        document.getElementById('mahasiswaTable').style.display = 'table';

        const tableBody = document.querySelector('#mahasiswaTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        mahasiswaData.forEach(mahasiswa => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mahasiswa.nim}</td>
                <td>${mahasiswa.nama}</td>
                <td>${mahasiswa.total_nilai}</td>
                <td>${mahasiswa.total_sks}</td>
                <td>${mahasiswa.ipk}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('errorMessage').textContent = `Error fetching data: ${error.message}`;
    }
}
