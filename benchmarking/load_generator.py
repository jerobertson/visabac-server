import sys
import time
import json
import requests
import numpy as np
import pandas as pd

url = ""
body = {}

# Sends a GET request to a given url, and records timings.
# Prints out:
# - Average response time
def get(count):
    times = []
    for i in range(count): # Make i requests, take the average of these.
        t0 = time.time()
        requests.get(url)
        times.append(int(round((time.time() - t0) * 1000)))
        print(str(i + 1) + "/" + str(count) + ": " + str(times[i]) + "ms")
    print("Avg.: " + str(np.mean(times)) + "ms")
    print("Times Description:")
    print(pd.Series(times).describe())

# Sends a POST request to a given url, and records timings.
# Prints out:
# - Average response time
def post(count):
    times = []
    internal_times = []
    for i in range(count):  # Make i requests, take the average of these.
        t0 = time.time()
        r = requests.post(url, json=body) # Post request body is set to JSON.
        times.append(int(round((time.time() - t0) * 1000)))
        internal_times.append(int(r.json()["debug"]["time_taken"]))
        print(str(i + 1) + "/" + str(count) + ": " + str(times[i]) + "ms" + " (" + str(internal_times[i]) + "ms)")
    print("Avg.: " + str(np.mean(times)) + "ms" + " (" + str(np.mean(internal_times)) + "ms)")
    print("Times Description:")
    print(pd.Series(times).describe())
    print("Internal Times Description:")
    print(pd.Series(internal_times).describe())

if __name__ == "__main__":
    # [1]: url
    # [2]: GET or POST
    # [3]: Number of requests for GET, or request body for POST.
    # [4]: Number of requests for POST.
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
    
