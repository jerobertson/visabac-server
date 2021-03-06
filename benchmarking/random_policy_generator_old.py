import sys
import argparse
import random
import json

compositors = ["DOV", "POV", "DUP", "PUD", "FA", "OPO", "ODO", "OOA"]

def build_tree(args):
    tree = {}
    tree[0] = [[]]

    levels = random.randint(args.min_depth, args.max_depth)

    for level in range(1, levels):
        tree[level] = []
        rule_count = random.randint(1, len(tree[level - 1]) * (args.max_composite_size - 1))
        r = 0
        while r < rule_count:
            parent = tree[level - 1][random.randint(0, len(tree[level - 1]) - 1)]
            if len(parent) == 0:
                tree[level].append([])
                parent.append(r)
                r += 1
                rule_count += 1
            if len(parent) < args.max_composite_size:
                tree[level].append([])
                parent.append(r)
            r += 1

    rules = ""
    attributes = {}

    for level, e in reversed(list(enumerate(tree))):
        for rule in range(len(tree[level])):
            if len(tree[level][rule]) == 0:
                rule_string = "\nR{}{}: {} if ATT{}{}".format(level, rule, random.choice(["Permit", "Deny"]), level, rule)
                rules += rule_string
                if random.random() < args.unknown_chance:
                    attributes["ATT{}{}".format(level, rule)] = "Unknown"
                else:
                    attributes["ATT{}{}".format(level, rule)] = random.choice(["True", "False"])
            else:
                compositor = random.choice(compositors)
                rule_string = "\nR{}{}: {}({}".format(level, rule, compositor, "R{}{}".format(level + 1, tree[level][rule][0]))
                for child in range(1, len(tree[level][rule])):
                    rule_string += ", {}".format("R{}{}".format(level + 1, tree[level][rule][child]))
                rule_string += ")"
                rules += rule_string

    body = {}
    body["policy"] = rules
    body["attributes"] = attributes

    if args.plaintext == True:
        print("Plaintext:")
        print(rules)
        print(json.dumps(attributes) + "\n")

    if args.json == True:
        print("JSON:\n")
        print(json.dumps(body) + "\n")

    if args.file is not None:
        with open(args.file, 'w') as outfile:
            if args.plaintext == True:
                outfile.write(rules)
                json.dump(attributes, outfile)
            elif args.json == True:
                json.dump(body, outfile)
            else:
                print("Please specify either --json or --plaintext when dumping to a file! Program will terminate.")

    return body

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--min-depth", help="Minimum number of levels for the policy tree", type=int, default=2)
    parser.add_argument("--max-depth", help="Maximum number of levels for the policy tree", type=int, default=5)
    parser.add_argument("--max-composite-size", help="Maximum number of rules in a composition", type=int, default=3)
    parser.add_argument("--unknown-chance", help="Chance an attribute is set as Unknown", type=float, default=0.66)
    parser.add_argument("--json", help="Print policy as JSON", action="store_true")
    parser.add_argument("--plaintext", help="Print policy as plaintext", action="store_true")
    parser.add_argument("--file", help="Name of the file to store the generated policy in. Requires either --json or --plaintext to be set", type=str)
    
    args = parser.parse_args()
    if args.json is False and args.plaintext is False and args.file is None:
        print("Please specify either --json, --plaintext, or --file! Program will terminate.")
    else:            
        build_tree(args)