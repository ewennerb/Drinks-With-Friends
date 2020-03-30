import mysql.connector
from mysql.connector import Error
import pandas as pd
import numpy as np

class pp():
    def __init__(self):
        print('starting preprocess')
        try:
            connection = mysql.connector.connect(
                host='localhost',
                database='test_schema',
                user='root',
                password='1234DrinksWithFriends')
            if connection.is_connected():
                cursor = connection.cursor(named_tuple=True)
                cursor.execute("SELECT t.tag FROM tags t")
                self.tags = list(cursor)
                self.df = {}
                for x in self.tags:
                    self.df[x.tag] = []
                #print(self.df)
                #print(len(self.df))
                #self.base_ing = ['rum', 'vodka', 'whiskey', 'sake', 'absinthe', 'beer', 'gin', 'ouza', 'tequila','wine', 'liqueur', 'spirit']
                cursor.execute("SELECT * FROM drink_tags dt")
                
                

        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

p = pp()