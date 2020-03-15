import mysql.connector
from mysql.connector import Error
try:
    connection = mysql.connector.connect(host='localhost',
        database='test_schema',
        user='root',
        password='1234DrinksWithFriends')
    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        
        cursor = connection.cursor(named_tuple=True)
        cursor.execute("SELECT * FROM drink")
        record = cursor.fetchall()
        for x in record:
            print(x.name)
            
        cursor.execute("SELECT * FROM user")
        record = cursor.fetchall()
        for x in record:
            print(x.name)

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")