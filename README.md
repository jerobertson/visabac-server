# visabac-server
An extension to [VisABAC](https://gitlab.com/morisset/visabac) that operates server-side using Node.js and Express and implements policy manipulation tools.

## Demo
The latest build is available at http://visabac-server.jerobertson.co.uk:3000/visualiserForm.html.

You should be able to use any REST client (such as [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)) to access the server-side aspect of visabac-server. Try making a POST request to any URL found in the Examples section below (and make sure your content type is set to 'application/json'!).

## Current Features
* The original VisABAC tool is still available at ```<url>/visualiserForm.html```.
* ```<url>/evaluate POST```: Parses the request body and returns the policy evaluation.
* ```<url>/evaluate?extended=true POST```: Parses the request body and returns an extended evaluation of the policy by analysing hidden attributes.
* ```<url>/compare POST```: Parses the request body and returns the differences between multiple policies for a given set of attributes.

## Examples
Here are some example requests and responses.

### Evaluate

```POST http://visabac-server.jerobertson.co.uk:3000/evaluate```

#### Request Body
```
{
    "policy": "PX: Deny if BILL_unpaid\nPY: Permit if OR(OWNER_allow, JUDGE_allow)\nPZ: DUP(PX, PY)",
    "attributes": {"JUDGE_allow":"Unknown","OWNER_allow":"False","BILL_unpaid":"Unknown"}
}
```

#### Response Body
```
{
    "PX": "Indeterminate(D)",
    "PY": "Indeterminate(P)",
    "PZ": "Deny"
}
```

### Extended Evaluation

```POST http://visabac-server.jerobertson.co.uk:3000/evaluate?extended=true```

#### Request Body
```
{
    "policy": "PX: Deny if BILL_unpaid\nPY: Permit if OR(OWNER_allow, JUDGE_allow)\nPZ: DOV(PX, PY)",
    "attributes": {"OWNER_allow":"False"}
}
```

#### Response Body
```
{
    "policy": {
        "PX": "Deny if BILL_unpaid",
        "PY": "Permit if OR(OWNER_allow, JUDGE_allow)",
        "PZ": "DOV(PX, PY)"
    },
    "request_attributes": {
        "OWNER_allow": "False"
    },
    "hidden_attributes": [
        "BILL_unpaid",
        "JUDGE_allow"
    ],
    "initial_evaluation": {
        "PX": "Indeterminate(PD)",
        "PY": "Indeterminate(P)",
        "PZ": "Indeterminate(PD)"
    },
    "evaluations": [
        {
            "request_attributes": {
                "OWNER_allow": "False",
                "JUDGE_allow": "True",
                "BILL_unpaid": "True"
            },
            "evaluation": {
                "PX": "Deny",
                "PY": "Permit",
                "PZ": "Deny"
            }
        },
        {
            "request_attributes": {
                "OWNER_allow": "False",
                "JUDGE_allow": "True",
                "BILL_unpaid": "False"
            },
            "evaluation": {
                "PX": "NotApplicable",
                "PY": "Permit",
                "PZ": "Permit"
            }
        },
        {
            "request_attributes": {
                "OWNER_allow": "False",
                "JUDGE_allow": "False",
                "BILL_unpaid": "True"
            },
            "evaluation": {
                "PX": "Deny",
                "PY": "NotApplicable",
                "PZ": "Deny"
            }
        },
        {
            "request_attributes": {
                "OWNER_allow": "False",
                "JUDGE_allow": "False",
                "BILL_unpaid": "False"
            },
            "evaluation": {
                "PX": "NotApplicable",
                "PY": "NotApplicable",
                "PZ": "NotApplicable"
            }
        }
    ]
}
```

### Policy Comparison

```POST http://visabac-server.jerobertson.co.uk:3000/compare```

#### Request Body
```
{
    "policies": [
        "PX: Deny if BILL_unpaid\nPY: Permit if OR(OWNER_allow, JUDGE_allow)\nPZ: DUP(PX, PY)",
        "PX: Deny if BILL_unpaid\nPY: Permit if OR(OWNER_allow, JUDGE_allow)\nPZ: PUD(PX, PY)",
        "PX: Deny if BILL_unpaid\nPY: Permit if OR(OWNER_allow, JUDGE_allow)\nPT: DOV(PX, PY)"
    ],
    "attributes": {"JUDGE_allow":"Unknown","OWNER_allow":"False","BILL_unpaid":"Unknown"}
}
```

#### Response Body
```
{
    "policies": [
        {
            "PX": "Deny if BILL_unpaid",
            "PY": "Permit if OR(OWNER_allow, JUDGE_allow)",
            "PZ": "DUP(PX, PY)"
        },
        {
            "PX": "Deny if BILL_unpaid",
            "PY": "Permit if OR(OWNER_allow, JUDGE_allow)",
            "PZ": "PUD(PX, PY)"
        },
        {
            "PX": "Deny if BILL_unpaid",
            "PY": "Permit if OR(OWNER_allow, JUDGE_allow)",
            "PT": "DOV(PX, PY)"
        }
    ],
    "attributes": {
        "JUDGE_allow": "Unknown",
        "OWNER_allow": "False",
        "BILL_unpaid": "Unknown"
    },
    "evaluations": {
        "PX": [
            "Indeterminate(D)",
            "Indeterminate(D)",
            "Indeterminate(D)"
        ],
        "PY": [
            "Indeterminate(P)",
            "Indeterminate(P)",
            "Indeterminate(P)"
        ],
        "PZ": [
            "Deny",
            "Permit",
            "Undefined"
        ],
        "PT": [
            "Undefined",
            "Undefined",
            "Indeterminate(PD)"
        ]
    }
}
```