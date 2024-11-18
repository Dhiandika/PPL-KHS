CREATE TABLE tb_mk (
    id_mk INT AUTO_INCREMENT PRIMARY KEY,
    nama_mk VARCHAR(255) NOT NULL,
    sks INT NOT NULL
);

CREATE TABLE tb_krs (
    id_krs INT AUTO_INCREMENT PRIMARY KEY,
    tahun INT NOT NULL,
    semester VARCHAR(50) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    id_mk INT NOT NULL,
    nilai VARCHAR(2) NOT NULL,
    FOREIGN KEY (id_mk) REFERENCES tb_mk(id_mk),
    FOREIGN KEY (nim) REFERENCES tb_mhs(nim)
);

CREATE TABLE tb_mhs (
    nim VARCHAR(20) PRIMARY KEY,
    nama_mhs VARCHAR(255) NOT NULL,
    ips FLOAT DEFAULT 0,
    ipk FLOAT DEFAULT 0
);

CREATE TABLE tb_ipk (
    id_ipk INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    tahun INT NOT NULL,
    ips FLOAT NOT NULL,
    ipk FLOAT NOT NULL,
    FOREIGN KEY (nim) REFERENCES tb_mhs(nim)
);