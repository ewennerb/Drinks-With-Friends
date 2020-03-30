import mysql.connector
from mysql.connector import Error
from kmeans import km
from preprocessing import pp
from tag_generation import generator
import random as rand

gen = generator()
gen.print_tags()

def save_group_to_database(data):
    try:
        connection = mysql.connector.connect(host='localhost',
            database='test_schema',
            user='root',
            password='1234DrinksWithFriends')
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_Info)
            cursor = connection.cursor(named_tuple=True)
            cursor.execute("TRUNCATE drink_recommendation")
            cursor.execute("SELECT u.userName as username, u.userId as id FROM user u")
            users = list(cursor)
            for x in users:
                for i in group:
                    cursor.execute("INSERT INTO test_schema.drink_recommendation (user_id, drink_id) VALUES (" + str(x.id) + ", "+ str(group[i][rand.randint(0, len(group[i])-1)])+  ")")
            
            connection.commit()
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

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
        
        prep = pp(cursor)
        df = prep.preprocess()
        cursor.execute("SELECT drinkId, name FROM drink")
        test = {}
        for x in cursor:
            test[x.drinkId] = x.name
        k = km(df, test, 10, .000001)
        group = k.run(True)
        for g in group:
            print(g)
            for i in group[g]:
                print("", int(i),test[int(i)])
        save_group_to_database(group)

except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if (connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")

