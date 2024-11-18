import pymysql
import json
import os
from decimal import Decimal

def lambda_handler(event, context):
    # Konfigurasi database
    db_config = {
        "host": os.environ['DB_HOST'],
        "user": os.environ['DB_USER'],
        "password": os.environ['DB_PASS'],
        "database": os.environ['DB_NAME'],
        "port": int(os.environ['DB_PORT']),
    }

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
        return bobot.get(bobot_nilai, 0.0)

    try:
        # Koneksi ke database
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Ambil NIM dari event
        nim = event.get('queryStringParameters', {}).get('nim')
        if not nim:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "NIM parameter is required"})
            }

        # Query untuk menghitung IPK kumulatif
        query = """
        SELECT 
            k.nilai, 
            mk.sks
        FROM tb_krs k
        JOIN tb_mk mk ON k.id_mk = mk.id_mk
        JOIN tb_mhs mh ON k.nim = mh.nim
        WHERE mh.nim = %s;
        """
        cursor.execute(query, (nim,))
        result = cursor.fetchall()

        if not result:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Data not found for the provided NIM"})
            }

        # Menghitung total nilai dan total sks
        total_nilai = 0
        total_sks = 0

        for row in result:
            nilai_numerik = hitung_nilai(row[0])  # Nilai huruf ke numerik
            sks = row[1]
            total_nilai += nilai_numerik * sks
            total_sks += sks

        # Menghitung IPK
        ipk = total_nilai / total_sks if total_sks > 0 else 0.0

        # Perbarui kolom IPK di tabel mahasiswa
        update_query = """
        UPDATE tb_mhs 
        SET ipk = %s 
        WHERE nim = %s;
        """
        cursor.execute(update_query, (round(ipk, 2), nim))
        connection.commit()

        # Kembalikan hasil IPK
        data = {
            "total_nilai": round(total_nilai, 2),
            "total_sks": total_sks,
            "ipk": round(ipk, 2)
        }

        return {
            "statusCode": 200,
            "body": json.dumps(data)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    finally:
        # Tutup koneksi
        if cursor:
            cursor.close()
        if connection:
            connection.close()
