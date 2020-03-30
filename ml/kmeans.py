import pandas as pd
import numpy as np
import array
import random as rand
import sys
import math

def Euclidean_distance(p, q):
    if len(p) is not len(q):
        print('error')
        return 0
    s = 0

    for i in range(len(q)):
        if i == 0:
            #print("skipping first", q[0])
            continue
        cur_p = p[i]
        cur_q = q[i]
        s += (cur_p - cur_q) ** 2
    return math.sqrt(s)     # sqrt(q1-p1 + q2-p2 + qn-pn)


class km():
    def __init__(self, df, names, k, tolerance):
        self.k = k
        self.centroids = []
        self.tolerance = tolerance
        data = df.astype(float).values.tolist()
        real_data = {}
        self.start = [53,86,81,72,104,68,48,57,38,102]
        for d in data:
            temp = d[0]
            #del d[0]
            real_data[int(temp)] = d

        self.data = data
        self.prev = 1.0
        self.cur_score = 0

    def set_centroids(self):
        
        for i in range(self.k):
            d = self.data[rand.randint(0, len(self.data)-1)]
            while d in self.centroids:
                d = self.data[rand.randint(0, len(self.data)-1)]
            self.centroids.append(d)

    def itterate_clusters(self):
        self.classes = {}
        for i in range(self.k):
            self.classes[i] = []
        
        for row in self.data:
            distances = [Euclidean_distance(row, centroid) for centroid in self.centroids]

            pos = distances.index(min(distances))
            self.classes[pos].append(row)

    def recalculate_clusters(self):
        self.last_centroid = [c for c in self.centroids]
        self.centroids = [np.average(self.classes[c], axis=0) for c in self.classes]


    def score(self, distance_fct):
        wc = 0
        self.prev = float(self.cur_score)
        for i in range(len(self.centroids)): # i = 1 to k clusters
            center = self.centroids[i]  # cluster center or mean
            points = self.classes[i]    # points in cluster
            for p in points:
                wc += distance_fct(p, center) ** 2
        
        self.cur_score = wc
        return wc
    def improved_score(self, distance_fct):
        wc = 0.0

        self.prev = float(self.cur_score)
        for i in range(len(self.centroids)): # i = 1 to k clusters
            center = self.centroids[i]  # cluster center or mean
            points = self.classes[i]    # points in cluster
            for p in points:
                wc += distance_fct(p, center) ** 2
        bc = 0.0
        for i in range(len(self.centroids)): # i = 1 to k clusters
            center = self.centroids[i]  # cluster center or mean
            for j in range(len(self.centroids)): # i = 1 to k clusters
                if i == j:
                    continue
                center2 = self.centroids[j]  # cluster center or mean
                bc += distance_fct(center, center2) ** 2
        self.cur_score = wc / bc
        return wc / bc
    
    def check_completion(self):
        if self.prev - self.cur_score < self.tolerance:
            return True
        return False

    def run(self, improved):
        dist = Euclidean_distance
        self.set_centroids()
        sys.stdout.flush()
        out = float('inf')
        while not self.check_completion():
            self.itterate_clusters()
            self.recalculate_clusters()
            if improved:
                out = self.improved_score(dist)
            else:
                out = self.score(dist)
        group = {}
        i = 1
        for p in self.classes:
            group['group'+str(i)] = []
            for ind in self.classes[p]:
                group['group'+str(i)].append(ind[0])
            i = i + 1
        count = 0
        for i in group:
            for c in group[i]:
                count = count + 1
        
        return group

    def get_furthest_point(self, dist_fct):
        self.furthest = {}
        for i in self.classes:
            center = self.centroids[i]
            self.furthest[i] = max([dist_fct(center, p)] for p in self.classes[i])

    