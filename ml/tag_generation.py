import mysql.connector
from mysql.connector import Error

class generator():
    def __init__(self):
        self.stop_words = ['white', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
        self.divider = 3
        self.min = 5
        try:
            connection = mysql.connector.connect(host='localhost',
                database='test_schema',
                user='root',
                password='1234DrinksWithFriends')
            if connection.is_connected():
                db_Info = connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                cursor = connection.cursor(named_tuple=True)
                cursor.execute("SELECT i.ingredient FROM drink_ingredient i")
                self.id = {}
                self.amount_of_drinks = 0
                for x in cursor:
                    word_arr = x.ingredient.split(' ')
                    for word in word_arr:
                        word = word.replace('(','')
                        word = word.replace('.','')
                        word = word.replace(')','')
                        word = word.replace(';','')
                        new_word = word.replace(',','')
                        if new_word not in self.stop_words:
                            self.id[new_word.lower()] = 0
                cursor.execute("SELECT d.description FROM drink d")
                for x in cursor:
                    self.amount_of_drinks = self.amount_of_drinks + 1
                    word_arr = x.description.split(' ')
                    for word in word_arr:
                        word = word.replace('(','')
                        word = word.replace('.','')
                        word = word.replace(')','')
                        word = word.replace(';','')
                        new_word = word.replace(',','')
                        if new_word not in self.stop_words:
                            self.id[new_word.lower()] = 0
                
                #print(self.id)

        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")
        self.freq_count()
        self.writeTags()

    def freq_count(self):
        try:
            connection = mysql.connector.connect(host='localhost',
                database='test_schema',
                user='root',
                password='1234DrinksWithFriends')
            if connection.is_connected():
                db_Info = connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                cursor = connection.cursor(named_tuple=True)
                cursor.execute("SELECT i.ingredient FROM drink_ingredient i")
                ingred_arr = []
                for x in cursor:
                    ingred_arr.append(x.ingredient)
                
                for word in self.id:
                    for y in ingred_arr:
                        if word in y.lower():
                            self.id[word] = self.id[word] + 1
                
                cursor.execute("SELECT i.description FROM drink i")
                des_array = []
                for x in cursor:
                    des_array.append(x.description.lower())
                for word in self.id:
                    for y in des_array:
                        if word in y:
                            self.id[word] = self.id[word] + 1
                #self.id['whiskey'] = self.min + 1
        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")
    def print_tags(self):
        tags = {}
        for x in self.id:
            if (self.id[x] > self.min and self.id[x] < self.amount_of_drinks / self.divider):
                print(x, self.id[x],"out of", self.amount_of_drinks)
                tags[x] = x

        print("amount of tags ", len(tags),"out of", len(self.id), 'candidates')
        
    def writeTags(self):
        try:
            connection = mysql.connector.connect(host='localhost',
                database='test_schema',
                user='root',
                password='1234DrinksWithFriends')
            if connection.is_connected():
                db_Info = connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                cursor = connection.cursor(named_tuple=True)
                cursor.execute("TRUNCATE tags")
                del_tags = []
                for x in self.id:
                    if (self.id[x] > self.min and self.id[x] < self.amount_of_drinks / self.divider):
                        s ="INSERT INTO test_schema.tags (tag) VALUES ('" + x + "')"
                        cursor.execute(s)
                    else:
                        del_tags.append(x)
                cursor.execute("TRUNCATE drink_tags")
                connection.commit()
                for x in del_tags:
                    del self.id[x]
                cursor.execute("SELECT * FROM tags t")
                for x in cursor:
                    self.id[x.tag] = x.idtags
                cursor.execute("SELECT d.drinkId, i.ingredient FROM drink d, drink_ingredient i WHERE i.drink_id = d.drinkId")
                rs = list(cursor)
                
                visited = []
                for x in rs:
                    for y in self.id:
                        if (y in x.ingredient and (str(x.drinkId), str(y)) not in visited):
                            visited.append((str(x.drinkId), str(y)))
                            s ="INSERT INTO test_schema.drink_tags (drink_id, tag_id) VALUES (" + str(x.drinkId) + ", "+ str(self.id[y]) + ")"
                            cursor.execute(s)

                
                connection.commit()
        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if (connection.is_connected()):
                cursor.close()
                connection.close()
                print("MySQL connection is closed")

