import pandas as pd
import numpy as np
import array


class km():
    def __init__(self, data, clusters):
        self.data = data
        self.k = clusters
        self.type_words = ['slushy', 'cream', 'coffee', 'hot', 'iced', 'bitters']#blended shaken stirred
        self.base_ing = ['rum', 'vodka', 'whiskey', 'sake', 'absinthe', 'beer', 'gin', 'ouza', 'tequila','wine', 'liqueur', 'spirit']
        

    def loadData(self):
        data = self.data


    def editDistance(self, test, pattern):
        i = len(pattern)
        j = len(test)
        misplace_error = 5
        missing_error = 1
        m = [[0]*i]*j
        while (i >= 0):


            i = i -1

