# visabac-server
An extension to [VisABAC](https://gitlab.com/morisset/visabac) that operates server-side using Node.js and Express and implements policy manipulation tools.

## Current Features
* The original VisABAC tool is still available at `<url`>/visualiserForm.html.
* `<url`>/evaluate POST: Parses the request body assuming the same format as VisABAC's save policy tool and returns the policy evaluation.