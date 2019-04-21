import sys
import json

# Generates a simple policy with a given number of attributes.
# All policies always evaluate to Permit - this tool is designed
# for benchmarking and not for actual policy creation.
def generate_policy(att_count):
    # Create a single rule, set it's attribute to true, and add it to the composite rule, P.
    body = {}
    body["policy"] = "R0: Permit if ATT0\n"
    body["attributes"] = {}
    body["attributes"]["ATT0"] = "True"
    composite = "P: DOV(R0"

    # Create all other rules, give then an unknown attribute, and add it to the composite rule, P.
    for i in range(1, att_count):
        body["policy"] += "R{}: Permit if ATT{}\n".format(i, i)
        body["attributes"]["ATT{}".format(i)] = "Unknown"
        composite += ", R{}".format(i)

    body["policy"] += composite + ")"
    return body


if __name__ == "__main__":
    # [1]: The number of rules in the policy.
    # [2]: The name of the file to dump this policy to (json format only).
    # If [2] does not exist, print to console.
    if len(sys.argv) >= 2:
        body = generate_policy(int(sys.argv[1]))
        if len(sys.argv) >= 3:
            with open(sys.argv[2], 'w') as outfile:
                json.dump(body, outfile)
        else:
            print(body)
    else:
        print("Invalid args!")