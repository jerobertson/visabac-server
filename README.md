# visabac-server
An extension to [VisABAC](https://gitlab.com/morisset/visabac) that operates server-side using Node.js and Express and implements policy manipulation tools.

## Demo
The latest build is available at http://visabac-server.jerobertson.co.uk:3000/visualiserForm.html.

You should be able to use any REST client (such as [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)) to access the server-side aspect of visabac-server. Try making a POST request to http://visabac-server.jerobertson.co.uk:3000/evaluate using the following body (and making sure your content type is set to 'text/plain'):

```
PX: Deny if BILL_unpaid
PY: Permit if OR(OWNER_allow, JUDGE_allow)
PZ: DUP(PX, PY)
{"JUDGE_allow":"Unknown","OWNER_allow":"False","BILL_unpaid":"Unknown"}
```

You should get the following response:

```
{
    "PX": "Indeterminate(D)",
    "PY": "Indeterminate(P)",
    "PZ": "Deny"
}
```

## Current Features
* The original VisABAC tool is still available at ```<url>/visualiserForm.html```.
* ```<url>/evaluate POST```: Parses the request body assuming the same format as VisABAC's save policy tool and returns the policy evaluation.