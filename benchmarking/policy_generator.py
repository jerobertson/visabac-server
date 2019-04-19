import sys
import json

def generate_policy(att_count):
    body = {}
    body["policy"] = "R0: Permit if ATT0\n"
    body["attributes"] = {}
    body["attributes"]["ATT0"] = "True"
    composite = "P: DOV(R0"

    for i in range(1, att_count):
        body["policy"] += "R{}: Permit if ATT{}\n".format(i, i)
        body["attributes"]["ATT{}".format(i)] = "Unknown"
        composite += ", R{}".format(i)

    body["policy"] += composite + ")"
    return body


if __name__ == "__main__":
    if len(sys.argv) >= 2:
        body = generate_policy(int(sys.argv[1]))
        if len(sys.argv) >= 3:
            with open(sys.argv[2], 'w') as outfile:
                json.dump(body, outfile)
        else:
            print(body)
    else:
        print("Invalid args!")