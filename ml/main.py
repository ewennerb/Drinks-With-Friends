import mysql.connector
from mysql.connector import Error
from kmeans import km
from preprocessing import pp
from tag_generation import generator
import random as rand

gen = generator()
gen.print_tags()

def get_random_drink_not(user_ratio_list, groups, user_liked_drinks):
    out_drinks = {}
    for user in user_ratio_list:
        out_drinks[user] = []
        for user_group in user_ratio_list[user]:
            for d in groups[user_group]:
                if d not in user_liked_drinks[user]:
                    out_drinks[user].append(d)

    return out_drinks

def get_rand_drink(groups, user_liked_list, out_drinks):
    for g in groups:
        drink = groups[g][rand.randint(0, len(groups[g]) - 1)]
        if drink not in user_liked_list and drink not in out_drinks:
            return drink

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
            cursor.execute("SELECT u.userName as username, u.userId as id, dl.drink_id, dl.likes FROM user u LEFT JOIN drink_likes dl ON dl.userName = u.userName")
            users = list(cursor)
            user_liked_list = {}
            for x in users:
                user_liked_list[x.id] = []
                
                if x.likes and x.likes > 0:
                    user_liked_list[x.id].append(x.drink_id)
            user_ratio_list = {}
            for username in user_liked_list:
                user_ratio_list[username] = []
                for drink_id in user_liked_list[username]:
                    for i in data:
                        if drink_id in data[i]:
                            user_ratio_list[username].append(i)
            user_candidates = get_random_drink_not(user_ratio_list, group, user_liked_list)
            user_drinks = {}
            for user in user_candidates:
                user_drinks[user] = []
                for i in range(5):
                    if (len(user_candidates[user]) > 0):
                        pos = rand.randint(0, len(user_candidates[user])-1)
                        user_drinks[user].append(user_candidates[user][pos])
                        del user_candidates[user][pos]
                for i in range(5 - len(user_drinks[user])):
                    
                    drink = get_rand_drink(data, user_liked_list[user], user_drinks[user])
                    if drink:
                        user_drinks[user].append(drink)
            for user in user_drinks:
                for drink in user_drinks[user]:
                    cursor.execute("INSERT INTO test_schema.drink_recommendation (user_id, drink_id) VALUES (" + str(user) + ", "+ str(drink)+  ")")
            
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

