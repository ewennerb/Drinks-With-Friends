import mysql.connector
from mysql.connector import Error
import pandas as pd
import numpy as np

class pp():

    def __init__(self, data):
        self.data = data
        self.type_words = ['slushy', 'cream', 'coffee', 'hot', 'iced', 'bitter', 'blended', 'shaken', 'stirred']
        self.base_ing = ['rum', 'vodka', 'whiskey', 'sake', 'absinthe', 'beer', 'gin', 'ouza', 'tequila','wine', 'liqueur', 'spirit']
        self.cols = []
        self.ingredient_cursor = {}
        self.prep_cursor = {}
        self.ids = []
        
    def preprocess(self):
        self.getIngredients()
        self.getPreparation()
        return self.setUpCols()

    def getIngredients(self):
        data = self.data
        data_frame_cols = self.base_ing
        try:
            connection = mysql.connector.connect(host='localhost',
                database='test_schema',
                user='root',
                password='1234DrinksWithFriends')
            if connection.is_connected():
                cursor = connection.cursor(named_tuple=True)
                
                for x in data:
                    cursor.execute("SELECT di.ingredient FROM drink_ingredient di WHERE di.drink_id = " + str(x.drinkId))
                    self.ids.append(str(x.drinkId))
                    self.ingredient_cursor[str(x.drinkId)] = []
                    for y in cursor:
                        self.ingredient_cursor[str(x.drinkId)].append(y.ingredient.lower())
                        if y.ingredient.lower() not in data_frame_cols:
                            data_frame_cols.append(y.ingredient.lower())
        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if (connection.is_connected()):
                #cursor.close()
                #connection.close()
                print("MySQL connection is closed")
        self.cols = data_frame_cols

    def getPreparation(self):
        
        try:
            connection = mysql.connector.connect(host='localhost',
                database='test_schema',
                user='root',
                password='1234DrinksWithFriends')
            if connection.is_connected():
                cursor = connection.cursor(named_tuple=True)
                for x in self.ids:
                    cursor.execute("SELECT * FROM drink d WHERE d.drinkId = " + str(x))
                    self.prep_cursor[str(x)] = []
                    for y in cursor:
                        for z in self.type_words:
                            if z in y.description:
                                self.prep_cursor[str(x)].append(z)
        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed") 
                
        for x in self.prep_cursor:
            for t in self.prep_cursor[x]:
                if t not in self.cols:
                    self.cols.append(t)

    def setUpCols(self):
        df = {}
        df['id'] = []
        for col in self.cols:
            
            df[col] = []
            for x in self.ids:
                if col in self.ingredient_cursor[x] or col in self.prep_cursor[x]:
                    df[col].append(2)
                else:
                    df[col].append(0)
        for x in self.ids:
            df['id'].append(x)
        return pd.DataFrame(df)
        

            