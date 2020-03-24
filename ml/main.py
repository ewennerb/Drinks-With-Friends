import mysql.connector
from mysql.connector import Error
from kmeans import km


t = km("", 3)
t.editDistance("test", "pattern")

"""
try:
    connection = mysql.connector.connect(host='localhost',
        database='test_schema',
        user='root',
        password='1234DrinksWithFriends')
    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        
        cursor = connection.cursor(named_tuple=True)
        

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
"""