import pymysql
import os

# Konfigurasi database
db_host = os.environ['DB_HOST']
db_user = os.environ['DB_USER']
db_password = os.environ['DB_PASSWORD']
db_name = os.environ['DB_NAME']

def lambda_handler(event, context):
    connection = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name,
        cursorclass=pymysql.cursors.DictCursor
    )
    try:
        with connection.cursor() as cursor:
            nim = event.get("pathParameters", {}).get("nim", None)
            if not nim:
                return {"statusCode": 400, "body": "NIM is required"}
            
            # Query data mahasiswa
            query = "SELECT * FROM tb_mhs WHERE NIM = %s"
            cursor.execute(query, (nim,))
            result = cursor.fetchone()
            
            if result:
                return {"statusCode": 200, "body": str(result)}
            else:
                return {"statusCode": 404, "body": "Mahasiswa not found"}
    finally:
        connection.close()
