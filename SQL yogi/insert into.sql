INSERT INTO tb_mk (nama_mk, sks) VALUES
('Matematika Dasar', 3),
('Algoritma dan Pemrograman', 4),
('Basis Data', 3),
('Jaringan Komputer', 2);

INSERT INTO tb_krs (tahun, semester, nim, id_mk, nilai) VALUES
(2024, 'Ganjil', '12345678', 1, 'A'),
(2024, 'Ganjil', '12345678', 2, 'B+'),
(2024, 'Genap', '12345678', 3, 'B'),
(2024, 'Genap', '12345678', 4, 'A');

INSERT INTO tb_mhs (nim, nama_mhs) VALUES
('12345678', 'Budi Santoso'),
('23456789', 'Dewi Sari');

INSERT INTO tb_ipk (nim, semester, tahun, ips, ipk) VALUES
('12345678', 'Ganjil', 2024, 3.75, 3.60),
('12345678', 'Genap', 2024, 3.50, 3.60);
