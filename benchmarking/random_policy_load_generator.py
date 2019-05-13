import sys
import argparse
import time
import json
import requests
import numpy as np
import pandas as pd
import random_policy_generator as rpg


# Posts a request to a given url, and records timings and returned debug information.
# Prints out:
# - Average response time
# - Average processing time
# - Short-stopping efficiency.
def post(args):
    times = []
    internal_times = []
    short_stopping = []
    for i in range(args.count): # Make i requests, take the average of these.
        body = rpg.build_tree(args)
        t0 = time.time()
        r = requests.post(args.url, json=body)
        times.append(int(round((time.time() - t0) * 1000)))
        try:
            debug = r.json()["debug"]
            eval_count = int(debug["eval_count"])
            max_evals = int(debug["max_evals"])
            internal_times.append(int(debug["time_taken"]))
            short_stopping.append((float(eval_count) / float(max_evals)) * 100)
            print("{}/{}: {}ms ({}ms) {}:{}".format(i + 1, args.count, times[len(times) - 1], internal_times[len(internal_times) - 1], eval_count, max_evals))
        except:
            # If the response doesn't have parsable JSON, we can just discard it and ignore this run.
            pass
    print("Avg.: {}ms ({}ms) {}%").format(np.mean(times), np.mean(internal_times), np.mean(short_stopping))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", help="URL to send requests to", type=str)
    parser.add_argument("--count", help="Number of random policies to generate and evaluate.", type=int, default=1)
    parser.add_argument("--min-depth", help="Minimum number of levels for the policy tree", type=int, default=2)
    parser.add_argument("--max-depth", help="Maximum number of levels for the policy tree", type=int, default=5)
    parser.add_argument("--max-composite-size", help="Maximum number of rules in a composition", type=int, default=3)
    parser.add_argument("--unknown-chance", help="Chance an attribute is set as Unknown", type=float, default=0.66)
    parser.add_argument("--leaf-chance", help="Chance a rule is not a composition", type=float, default=-1.0)
    
    args = parser.parse_args()

    # Set attributes required for random_policy_generator (such that nothing is printed out).
    setattr(args, "json", False)
    setattr(args, "plaintext", False)
    setattr(args, "file", None)
    
    if args.url is not None:
        post(args)