import sys
import argparse
import random
import json

compositors = ["DOV", "POV", "DUP", "PUD", "FA", "OPO", "ODO", "OOA"]

def build_tree(args):
    tree = []
    tree.append([random.choice(range(2, args.max_composite_size + 1))])

    level_count = random.randint(max(2, args.min_depth), args.max_depth)

    for level in range(1, level_count):
        tree.append([])
        for parent in tree[level - 1]:
            if parent != 0:
                if (level + 1 == level_count):
                    for i in range(parent):
                        tree[level].append(0)
                else:
                    tree[level].append(random.randint(2, args.max_composite_size))
                    for i in range(1, parent):
                        if random.random() < args.leaf_chance:
                            tree[level].append(0)
                        else:
                            tree[level].append(random.randint(2, args.max_composite_size))

    rules = ""
    attributes = {}

    for level, e in reversed(list(enumerate(tree))):
        counter = 0
        child = 0
        for rule in e:
            if rule == 0:
                rule_string = "\nR{}{}: {} if ATT{}{}".format(level, counter, random.choice(["Permit", "Deny"]), level, counter)
                rules += rule_string
                if random.random() < args.unknown_chance:
                    attributes["ATT{}{}".format(level, counter)] = "Unknown"
                else:
                    attributes["ATT{}{}".format(level, counter)] = random.choice(["True", "False"])
                counter += 1
            else:
                compositor = random.choice(compositors)
                rule_string = "\nR{}{}: {}(R{}{}".format(level, counter, compositor, level + 1, child)
                child += 1
                for c in range(1, rule):
                    rule_string += ", R{}{}".format(level + 1, child)
                    child += 1
                rule_string += ")"
                rules += rule_string
                counter += 1

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
    parser.add_argument("--leaf-chance", help="Chance a rule is not a composition", type=float, default=-1.0)
    parser.add_argument("--unknown-chance", help="Chance an attribute is set as Unknown", type=float, default=0.66)
    parser.add_argument("--json", help="Print policy as JSON", action="store_true")
    parser.add_argument("--plaintext", help="Print policy as plaintext", action="store_true")
    parser.add_argument("--file", help="Name of the file to store the generated policy in. Requires either --json or --plaintext to be set", type=str)
    
    args = parser.parse_args()
    if args.leaf_chance < 0 or args.leaf_chance > 1:
        setattr(args, "leaf_chance", 1.0 / args.max_composite_size)
    if args.unknown_chance < 0 or args.unknown_chance > 1:
        setattr(args, "unknown_chance", 0.66)

    if args.json is False and args.plaintext is False and args.file is None:
        print("Please specify either --json, --plaintext, or --file! Program will terminate.")
    else:            
        build_tree(args)