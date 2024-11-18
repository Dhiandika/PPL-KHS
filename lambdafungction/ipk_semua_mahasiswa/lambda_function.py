import pymysql
import json
import os

def lambda_handler(event, context):
    # Konfigurasi database
    db_config = {
        "host": os.environ['DB_HOST'],
        "user": os.environ['DB_USER'],
        "password": os.environ['DB_PASS'],
        "database": os.environ['DB_NAME'],
        "port": int(os.environ['DB_PORT']),
    }

    try:
        # Koneksi ke database
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Query untuk mengambil id_mk, nama_mk, dan sks dari tabel tb_mk
        query = "SELECT id_mk, nama_mk, sks FROM tb_mk"
        cursor.execute(query)
        result = cursor.fetchall()

        # Format hasil query menjadi list of dictionaries
        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in result]

        # Return response
        return {
            "statusCode": 200,
            "body": json.dumps(data)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }

    finally:
        # Tutup koneksi
        if cursor:
            cursor.close()
        if connection:
            connection.close()
