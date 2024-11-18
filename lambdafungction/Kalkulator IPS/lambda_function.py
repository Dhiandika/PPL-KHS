import pymysql
import json
import os
from decimal import Decimal


def lambda_handler(event, context):
    # Konfigurasi database dari environment variables
    db_config = {
        "host": os.getenv('DB_HOST'),
        "user": os.getenv('DB_USER'),
        "password": os.getenv('DB_PASS'),
        "database": os.getenv('DB_NAME'),
        "port": int(os.getenv('DB_PORT', 3306)),  # Default MySQL port
    }

    # Ambil parameter NIM dari query string
    nim = event.get('queryStringParameters', {}).get('nim')
    if not nim:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"  # Untuk mendukung CORS
            },
            "body": json.dumps({"error": "NIM parameter is required"})
        }

    # Fungsi untuk mengonversi Decimal ke float
    def convert_decimal(value):
        if isinstance(value, Decimal):
            return float(value)
        return value

    # Fungsi untuk mengonversi nilai huruf ke nilai numerik
    def hitung_nilai(bobot_nilai):
        bobot = {
            "A": 4.0,
            "B+": 3.5,
            "B": 3.0,
            "C+": 2.5,
            "C": 2.0,
            "D+": 1.5,
            "D": 1.0,
            "E": 0.0
        }
        # Default 0 jika nilai tidak dikenali
        return bobot.get(bobot_nilai, 0.0)

    connection = None
    cursor = None
    try:
        # Koneksi ke database
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Query untuk mengambil nilai dan SKS per semester
        query = """
            SELECT 
                k.semester, 
                k.tahun, 
                k.nilai, 
                mk.sks
            FROM tb_krs k
            JOIN tb_mk mk ON k.id_mk = mk.id_mk  
            JOIN tb_mhs m ON k.nim = m.nim  
            WHERE m.nim = %s
            ORDER BY k.tahun, k.semester;
        """
        cursor.execute(query, (nim,))
        result = cursor.fetchall()

        # Pengecekan jika tidak ada data ditemukan
        if not result:
            return {
                "statusCode": 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": "Data not found for the provided NIM"})
            }

        # Format hasil query menjadi list of dictionaries
        columns = [col[0].lower() for col in cursor.description]
        data = [dict(zip(columns, row)) for row in result]

        # Mengonversi Decimal ke float
        data = [{k: convert_decimal(v)
                 for k, v in item.items()} for item in data]

        # Menghitung IPS per semester
        semesters = []
        semester_data = {}
        for row in data:
            semester_key = (row['tahun'], row['semester'])
            nilai_numerik = hitung_nilai(row['nilai'])
            sks = row['sks']

            # Inisialisasi data semester jika belum ada
            if semester_key not in semester_data:
                semester_data[semester_key] = {
                    "total_nilai": 0, "total_sks": 0}

            # Tambahkan nilai dan SKS untuk semester yang sama
            semester_data[semester_key]["total_nilai"] += nilai_numerik * sks
            semester_data[semester_key]["total_sks"] += sks

        # Menghitung IPS untuk setiap semester dan format data
        for (tahun, semester), values in semester_data.items():
            total_nilai = values["total_nilai"]
            total_sks = values["total_sks"]
            ips = total_nilai / total_sks if total_sks > 0 else 0.0
            semesters.append({
                "tahun": tahun,
                "semester": semester,
                "total_nilai": round(total_nilai, 2),
                "total_sks": total_sks,
                "ips": round(ips, 2)
            })

        # Update IPS terakhir ke tabel mahasiswa
        if semesters:
            latest_semester = semesters[-1]  # IPS dari semester terakhir
            update_ips_query = """
                UPDATE tb_mhs
                SET ips = %s
                WHERE nim = %s;
            """
            cursor.execute(update_ips_query, (latest_semester["ips"], nim))
            connection.commit()

        # Return response
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(semesters)
        }

    except Exception as e:
        # Logging error untuk debugging
        print("Error occurred:", str(e))
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": "Internal server error", "details": str(e)})
        }

    finally:
        # Tutup koneksi database
        if cursor:
            cursor.close()
        if connection:
            connection.close()
