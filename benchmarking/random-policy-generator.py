import sys
import argparse
import random
import json

compositors = ["DOV", "POV", "DUP", "PUD", "FA", "OPO", "ODO", "OOA"]

class Rule:
    def __init__(self, id):
        self.id = id
        self.children = []

def build_tree(args):
    tree = {}
    tree[0] = [{"id": 0, "children": []}]

    levels = random.randint(args.min_depth, args.max_depth)

    for level in range(1, levels):
        tree[level] = []
        rule_count = random.randint(1, len(tree[level - 1]) * (args.max_composite_size - 1))
        for r in range(rule_count):
            parent = random.randint(0, len(tree[level - 1]) - 1)
            if len(tree[level - 1][parent]["children"]) == 0:
                tree[level].append({"id": r + rule_count, "children": []})
                tree[level - 1][parent]["children"].append(r + rule_count)
            if len(tree[level - 1][parent]["children"]) < args.max_composite_size:
                tree[level].append({"id": r, "children": []})
                tree[level - 1][parent]["children"].append(r)

    rules = ""
    attributes = {}
    if args.json == False or args.plaintext == True:
        print("Plaintext:\n")

    for level, e in reversed(list(enumerate(tree))):
        for rule in range(len(tree[level])):
            if len(tree[level][rule]["children"]) == 0:
                rule_string = "R{}{}: {} if ATT{}{}".format(level, rule, random.choice(["Permit", "Deny"]), level, rule)
                if args.json == True:
                    if args.plaintext == True:
                        print(rule_string)
                    rules += rule_string + "\n"
                else:
                    print(rule_string)
                if random.random() < args.unknown_chance:
                    attributes["ATT{}{}".format(level, rule)] = "Unknown"
                else:
                    attributes["ATT{}{}".format(level, rule)] = random.choice(["True", "False"])
            else:
                compositor = random.choice(compositors)
                rule_string = "R{}{}: {}({}".format(level, rule, compositor, "R{}{}".format(level + 1, tree[level][rule]["children"][0]))
                for child in range(1, len(tree[level][rule]["children"])):
                    rule_string += ", {}".format("R{}{}".format(level + 1, tree[level][rule]["children"][child]))
                rule_string += ")"
                if args.json == True:
                    if args.plaintext == True:
                        print(rule_string)
                    rules += rule_string + "\n"
                else:
                    print(rule_string)

    if args.json == True:
        if args.plaintext == True:
            print(json.dumps(attributes) + "\n")
        print("JSON:\n")
        body = {}
        body["policy"] = rules
        body["attributes"] = attributes
        print(json.dumps(body))
    else:
        print(json.dumps(attributes))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--min-depth", help="Minimum number of levels for the policy tree", type=int, default=2)
    parser.add_argument("--max-depth", help="Maximum number of levels for the policy tree", type=int, default=5)
    parser.add_argument("--max-composite-size", help="Maximum number of rules in a composition", type=int, default=3)
    parser.add_argument("--unknown-chance", help="Chance an attribute is set as Unknown", type=float, default=0.66)
    parser.add_argument("--json", help="Print policy as JSON", action="store_true")
    parser.add_argument("--plaintext", help="Print policy as plaintext (only required if --json flag is also set)", action="store_true")
    
    args = parser.parse_args()
    build_tree(args)