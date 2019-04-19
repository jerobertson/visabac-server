import sys
import time
import json
import requests
import numpy as np
import pandas as pd

url = ""
body = {}

def get(count):
    times = []
    for i in range(count):
        t0 = time.time()
        requests.get(url)
        times.append(int(round((time.time() - t0) * 1000)))
        print(str(i + 1) + "/" + str(count) + ": " + str(times[i]) + "ms")
    print("Avg.: " + str(np.mean(times)) + "ms")
    print("Times Description:")
    print(pd.Series(times).describe())

def post(count):
    times = []
    internal_times = []
    for i in range(count):
        t0 = time.time()
        r = requests.post(url, json=body)
        times.append(int(round((time.time() - t0) * 1000)))
        internal_times.append(int(r.json()["time_taken"]))
        print(str(i + 1) + "/" + str(count) + ": " + str(times[i]) + "ms" + " (" + str(internal_times[i]) + "ms)")
    print("Avg.: " + str(np.mean(times)) + "ms" + " (" + str(np.mean(internal_times)) + "ms)")
    print("Times Description:")
    print(pd.Series(times).describe())
    print("Internal Times Description:")
    print(pd.Series(internal_times).describe())

if __name__ == "__main__":
    if len(sys.argv) >= 4:
        url = sys.argv[1]
    else:
        print("Invalid args!")

    if sys.argv[2] == "POST" and len(sys.argv) >= 5:
        with open(sys.argv[3]) as json_file:
            body = json.load(json_file)

            print("Performing POST on " + url + " using the following body:")
            print(body)
            post(int(sys.argv[4]))
    else:
        print("Performing GET on " + url + "")
        get(int(sys.argv[3]))
    
