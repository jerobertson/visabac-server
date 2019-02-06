# Introduction 

Authoring and editing access control policies can be a complicated and cognitive-demanding task, especially when dealing with complex ones. Visualisation techniques are known to be helpful to users analysing intricate data, and can, in some contexts, help decreasing the cognitive load.

VisABAC pursues the visualisation of attribute based access control policies using visualisation techniques (diagrams, colour schemes, patterns...). At this moment is favouring Zoomable Circle Packing as the preferred visualisation technique but other visualisations are being investigated as well and are planned for future releases.

VisABAC is an ongoing effort coordinated at Newcastle University and aspires to provide varied visualisation approaches to attribute based access control policies management, both to educative and professional purposes. It is distributed under an MIT license and we invite you to contribute.

# Usage

VisABAC is fully defined in Javascript, using the [D3.js](https://d3js.org/) library. You can simply checkout the repository and open the visualiserForm.html file, which will load the visualiser. An example is hosted on http://homepages.cs.ncl.ac.uk/charles.morisset/visabac/visualiser/resources/pages/visualiserForm.html (with a slightly different file structure). 
The visualiser comes with a variety of pre-defined samples, and as the possibility of loading and saving policies. Policies can be directly modified in the browser, and new attributes can be added dynamically. 

The values of policy attributes can be selected in the radio menu, and clicking on Evaluate will evaluate the policy and update the circle packing. 

# Policy syntax

The syntax of the policy is relatively straight-forward: 

- A simple rule has the form: *Name* **:** *Decision* **if** *Target*, where *Name* is the rule identifier, *Decision* is either **Permit** or **Deny**, and where *Target* is a boolean expression (using the prefix operators **OR** and **AND**) over attributes (see samples for examples).
- A composite rule has the form: *Name* **:** *Operator(Id<sub>1</sub>, Id<sub>2</sub>, ..., Id<sub>n</sub>)*, where *Name* is the rule identifier, *Operator* is a policy operator (currently supported operators are **POV**, **DOV**, **PUD**, **DUP**, **FA**, **OOA**, see Help in the visualiser for further details), and all *Id<sub>i</sub>* are rule identifier. 

The last policy defined is considered to be the top-level policy. 

# About

This prototype was designed, coded and implemented by David Enrique Sanchez Oliva at Newcastle University, UK, during 2016-2017 as part of a research in Visualisation of Access Control Policies. The research was supervised by [Dr. Charles Morisset](http://www.morisset.eu).

This prototype was created using Javascript, HTML and CSS. It was tested in Firefox 50-51 under macOS 10.11.6 and 10.12.4 (OS X El Capitan-Sierra) on a MacBook and iMac. It was coded using NetBeans 8.2. Additional testing is required in other browsers and platforms.