import sys
import argparse
import random
import json

compositors = ["DOV", "POV", "DUP", "PUD", "FA", "OPO", "ODO", "OOA"] # All the compositors available in VisABAC.

# Builds a policy tree, returning a JSON representation,
# but also prints out a plaintext version of the policy if requested,
# and can store the policy to a file.
#
# A policy tree consists of two types of nodes, leaf-rules (with no children),
# and composite-rules (with 2-n children).
def build_tree(args):
    tree = []
    tree.append([random.choice(range(2, args.max_composite_size + 1))]) # Give the root node 2-n children.

    # Determine how many levels the tree should have, between min-depth and max-depth args.
    level_count = random.randint(max(2, args.min_depth), args.max_depth)

    # Build the structure of the tree, an array of arrays, where each inner-array element is a number representing
    # a rule (and more specifically, the number of children it has).
    for level in range(1, level_count):
        tree.append([]) # Each level of the tree starts with an empty array (no rules).
        for parent in tree[level - 1]: # For each rule in the level above, if it has children, generate these children now.
            if parent != 0: # The parent has children, so generate these now.
                if (level + 1 == level_count):
                    # This is the last level of the tree, so all children should have 0 children of their own.
                    for i in range(parent):
                        tree[level].append(0)
                else:
                    # This is not the last level of the tree, so we need to guarantee at least one rule on this level has children.
                    # As such, we automatically give the first rule on this level 2-n children, and for all subsequent rules
                    # we give it either 0, or 2-n rules depending on the leaf_chance.
                    tree[level].append(random.randint(2, args.max_composite_size)) # First rule must have children.
                    for i in range(1, parent):
                        if random.random() < args.leaf_chance:
                            tree[level].append(0) # This is a leaf-rule.
                        else:
                            tree[level].append(random.randint(2, args.max_composite_size)) # This is a composite-rule.

    rules = ""
    attributes = {}

    # Now the tree has been built, we work from the bottom to the top and generate the actual policy string/json.
    # Rules take on the form "R{1}{2}" where {1} is the level, and {2} is the rule number in that level.
    #
    # If a rule is a leaf-rule, it has a matching attribute, "ATT{1}{2}", which is either True, False, or Unknown
    # depending on the unknown-chance arg.
    for level, e in reversed(list(enumerate(tree))):
        counter = 0 # The rule number in this level.
        child = 0 # For rule compositions, the number of the child in the level below.
        for rule in e:
            if rule == 0: # leaf-rule
                # Generate a rule string containing either Permit, Deny, or Unknown,
                # and then generate an attribute for the rule.
                rule_string = "\nR{}{}: {} if ATT{}{}".format(level, counter, random.choice(["Permit", "Deny"]), level, counter)
                rules += rule_string
                if random.random() < args.unknown_chance:
                    attributes["ATT{}{}".format(level, counter)] = "Unknown"
                else:
                    attributes["ATT{}{}".format(level, counter)] = random.choice(["True", "False"])
                counter += 1
            else: # composite-rule
                # Pick a random compositor, then generate a composite rule string for all the rule's children.
                compositor = random.choice(compositors)
                rule_string = "\nR{}{}: {}(R{}{}".format(level, counter, compositor, level + 1, child)
                child += 1
                for c in range(1, rule):
                    rule_string += ", R{}{}".format(level + 1, child)
                    child += 1
                rule_string += ")"
                rules += rule_string
                counter += 1
    
    # Build a JSON structure to return containing the rules and attributes.
    body = {}
    body["policy"] = rules
    body["attributes"] = attributes

    # Print the plaintext to console, in an identical format used by VisABAC's save file.
    if args.plaintext == True:
        print("Plaintext:")
        print(rules)
        print(json.dumps(attributes) + "\n")

    # Print out the json to console, in an identical format used by VisABAC-Server's API.
    if args.json == True:
        print("JSON:\n")
        print(json.dumps(body) + "\n")

    # Dump the policy into a file in either the plaintext or json format.
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
        # If leaf-chance is out of bounds, set it to 1/the max composite size, making it equally likely as any other size.
        setattr(args, "leaf_chance", 1.0 / args.max_composite_size)

    if args.json is False and args.plaintext is False and args.file is None:
        print("Please specify either --json, --plaintext, or --file! Program will terminate.")
    else:            
        build_tree(args)