/* 
 * David Sanchez
 * Newcastle University 2016
 * 
 * This code is used to draw a Logic Circle Packing
 * Code adapted from Mike Bostock D3 Samples
 * 
 * It requires a JSON object to be passed to the function logicCirclePacking
 * 
 */





/**
 * This declaration avoids the common alert that d3 is not declared
 * @type window.d3|Window.d3
 */
var d3 = window.d3 || {};









/**
 * This creates a new logicCirclePacking object
 * @param {type} root
 * @returns {logicCirclePacking}
 */
var LogicCirclePacking = function (root) {

    //Global variables for the object
    var margin = 60;
    var diameter = 900;


    //Colours Operations
    var myBlack = 'rgb(0,0,0)';   //black. Safari does not support 'black'

    //Permit=1
    var myGreen = "#3CA542";    //'rgb(0,150,0)'; green. Safari does not support 'green'
    var myBlue = "#0000FF";
    var permitColour = (preferences['colourPreferences'] === "Normal") ? myGreen : myBlue;

    //Deny=0
    var myRed = "#D77B79"; //'rgb(255,0,0)';//red. Safari does not support 'red'
    var myYellow = "#DAA520"; //Golden Yellow
    var denyColour = (preferences['colourPreferences'] === "Normal") ? myRed : myYellow;

    //NotApplicable=-1
    var notApplicableColour = '#FFFFFF';       //white.
    //Indeterminate(P)
    var indeterminatePColour = '#D3D3D3';    //Light gray color
    //Indeterminate(D)
    var indeterminateDColour = '#808080';         //gray color
    //Indeterminate(PD) and Interminate
    var indeterminatePDColour = '#A9A9A9';       //Dark gray


    //This creates a colour domain and range. It will asign elements in the range
    //according to the domain
    var color = d3.scale.linear()
            .domain([-5, -4, -3, -2, -1, 0, 1])
            //Color range in case patterns are not used
            //.range([indeterminatePDColour,indeterminatePDColour,indeterminateDColour,indeterminatePColour,notApplicableColour, denyColour, permitColour])
            .range([indeterminateDColour, indeterminatePColour, indeterminatePDColour, indeterminateDColour, notApplicableColour, denyColour, permitColour])
            .interpolate(d3.interpolateHcl);


    //This creates a pack structure which is used by the library to draw the circles
    //The library does the work
    var pack = d3.layout.pack()
            .padding(2)
            .size([diameter - margin, diameter - margin])
            .value(function (d) {
                return d.value;
            });


    //This is the place where everything is going to be drawn
    var svg = d3.select("#container").append("svg")

            .attr("preserveAspectRatio", "xMidYMin slice")
            .attr("viewBox", "0 0 920 920")
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    //Pattern definition    
    svg.append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatchGreen')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 15)
            .attr('height', 15)
            .attr('patternTransform', 'rotate(45)')
            .attr('viewBox', '0 0 7 7')
            .append('path')
            .attr('d', 'M 0 0 L 7 0 L 7 7 L 0 7 z')
            .attr('fill', indeterminatePColour)
            .attr('stroke', permitColour);

    //Pattern definition    
    svg.append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatchRed')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 15)
            .attr('height', 15)
            .attr('patternTransform', 'rotate(45)')
            .attr('viewBox', '0 0 7 7')
            .append('path')
            .attr('d', 'M 0 0 L 7 0 L 7 7 L 0 7 z')
            .attr('fill', indeterminatePColour)
            .attr('stroke', denyColour);

    //Pattern definition    
    svg.append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatchGray')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 15)
            .attr('height', 15)
            .attr('patternTransform', 'rotate(45)')
            .attr('viewBox', '0 0 7 7')
            .append('path')
            .attr('d', 'M 0 0 L 7 0 L 7 7 L 0 7 z')
            .attr('fill', indeterminatePColour)
            .attr('stroke', indeterminateDColour);


    //This variable is used to keep track of where the focus lays inside the graph
    //Which circle is selected
    var focus = root,
            nodes = pack.nodes(root),
            view;


    //D3 library allows to give instructions to all circles at the same time.
    //This code is applied to each circle
    var circle = svg.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function (d) {
                return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
            })
            .style("stroke-width", function (d) {
                if (d.logic === "NOT") {
                    //This moves the DOM element one level up so it draws on top of the inner operation.
                    this.parentNode.appendChild(this);

                    return '5px';
                } else if (d.logic === "AND" || d.logic === "OR") {
                    return '2px';
                }
            })

            .style("fill", function (d) {
                if (d.logic === "NOT") {
                    return 'none';
                } else if (d.rate === -2) {
                    //Indeterminate(P)
                    return 'url(#diagonalHatchGreen)';
                } else if (d.rate === -3) {
                    //Indeterminate(D)
                    return 'url(#diagonalHatchRed)';
                } else if (d.rate === -4) {
                    return 'url(#diagonalHatchGray)';
                } else if (d.rate === -5) {
                    return 'url(#diagonalHatchGray)';
                } else
                    //Indeterminate(PD) LightGray
                    //Indeterminate Gray
                    return color(d.rate);
            })
            .style("fill-opacity", function (d) {
                return (!d.hasOwnProperty("children") ? 0 : 1);


            })
            .style("stroke", function (d) {
                if (d.logic === "NOT" && d.rate === -1)
                    return denyColour;
                else if (d.logic === "NOT" && d.rate === 1)
                    return permitColour;
                else
                    return myBlack;
            })
            .style("stroke-dasharray", function (d) {
                if (d.logic === "AND" || d.logic === "DOV")
                    //Deny-overrides = AND
                    //
                    //  DOV  | P    | D | NA   | I(P) | I(D) | I(DP)
                    // ---------------------------------------------
                    //  P    | P    | D | P    | P    | I(PD)| I(DP)
                    //  D    | D    | D | D    | D    | D    | D
                    //  NA   | P    | D | NA   | I(P) | I(D) | I(PD)
                    //  I(P) | P    | D | I(P) | I(P) | I(PD)| I(PD)
                    //  I(D) | I(PD)| D | I(D) | I(PD)| I(D) | I(PD)
                    //  I(PD)| I(PD)| D | I(PD)| I(PD)| I(PD)| I(PD)
                    //----------------------------------------------   1 Permit (5permits)
                    //
                    return 0;

                else if (d.logic === "OOA")
                    //Only-one applicable.
                    //First operand row, second operand column
                    //
                    //  OOA  | P    | D    | NA   | I(P) | I(D) | I(PD)
                    // ---------------------------------------------
                    //  P    | I    | I    | P    | I(P) | I(D) | I(PD)
                    //  D    | I    | I    | D    | D(P) | I(D) | I(PD)
                    //  NA   | P    | D    | NA   | I(P) | I(D) | I(PD)
                    //  I(P) | I(P) | I(P) | I(P) | I(P) | I(PD)| I(PD)
                    //  I(D) | I(D) | I(D) | I(D) | I(PD)| I(D) | I(PD)
                    //  I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
                    //-------------------------------------------------
                    //
                    //---.---.---.---.---   2 Permits
                    return "40, 7, 10, 7";

                else if (d.logic === "FA")
                    //First applicable.
                    //First operand row, second operand column
                    //
                    //  FA   | P    | D    | NA   | I(P) | I(D) | I(PD)
                    // ---------------------------------------------
                    //  P    | P    | P    | P    | P    | P    | P
                    //  D    | D    | D    | D    | D    | D    | D
                    //  NA   | P    | D    | NA   | I(P) | I(D) | I(PD)
                    //  I(P) | I(P) | I(P) | I(P) | I(P) | I(P) | I(P)
                    //  I(D) | I(D) | I(D) | I(D) | I(D) | I(D) | I(D)
                    //  I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
                    //-------------------------------------------------
                    //
                    //---...---...---...--- 4 Permits (7 permits)
                    return "100, 7, 7, 7, 7, 7, 7, 7";

                else if (d.logic === "PUD")
                    //Permit unless deny
                    //
                    // PUD | P | D | U
                    // ---------------
                    //  P  | P | D | P
                    //  D  | D | D | D
                    //  U  | P | D | P
                    //
                    //||||||||||||||||||||| 4 Permits
                    return 2;

                else if (d.logic === "DUP")
                    //Permit unless deny
                    //
                    //  PUD  | P | D    | NA   | I(P) | I(D) | I(PD)
                    // ---------------------------------------------
                    //  P    | P | D    | P    | P    | P    | P
                    //  D    | D | D    | D    | D    | D    | D
                    //  NA   | P | D    | P    | P    | P    | P
                    //  I(P) | P | D    | P    | P    | P    | P
                    //  I(D) | P | D    | P    | P    | P    | P
                    //  I(PD)| P | D    | P    | P    | P    | P
                    //-------------------------------------------------
                    //
                    //||||||||||||||||||||| 4 Permits (25 permits)
                    return 5;

                else if (d.logic === "OR" || d.logic === "POV")
                    //Permit overrides = OR
                    //
                    //  POV  | P | D    | NA   | I(P) | I(D) | I(PD)
                    // ---------------------------------------------
                    //  P    | P | P    | P    | P    | P    | P
                    //  D    | D | D    | D    | I(PD | D    | I(PD)
                    //  NA   | P | D    | NA   | I(P) | I(D) | I(PD)
                    //  I(P) | P | I(PD)| I(P) | I(P) | I(PD)| I(PD)
                    //  I(D) | P | D    | I(D) | I(PD)| I(D) | I(PD)
                    //  I(PD)| P | I(PD)| I(PD)| I(PD)| I(PD)| I(PD)
                    //-------------------------------------------------
                    //
                    //-   -    -   -    -   5 Permits (10 Permits)
                    return 30;

                else
                    //Lines for nodes
                    return 0;
            })

            //This attaches an event to stop the propagation of an event
            .on("click", function (d) {
                if (focus !== d)
                    zoom(d), d3.event.stopPropagation();
            });


    //D3 library allows give instructions to all text elements at once.
    var text = svg.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("dy", function (d) {
                //Moves the initial text labels to the top of the circle
                //If the element has logic
                return d.logic !== "" ? -d.r : 0;
            })





            //==================================================================
            //This code was partially commented in order to show all labels of all 
            //sub leveles at once. Removing all coments in this section will activate
            //labels that only show on the top level and will disclose information
            //while navigating.
            .style("fill-opacity", function (d) {
                //Show labels at all leves except attributes when zoomed
                if (d.attribute === true && d.parent !== focus) {
                    return 0;
                } else
                    return 1;
                //Show only first two levels of labels
//                return (d.parent === root || d === root) ? 1 : 0;
            })



            //
            //
            //
            //Show only first two levels of labels
//            .style("display", function (d) {
//                return (d.parent === root || d === root) ? "inline" : "none";
//            })
//            
//                            //Show labels at all leves except attributes when zoomed
// .style("display", function (d) {
//                if (d.attribute === true && (d.parent !== focus)) {
//                    this.style.display = "none";
//                } else
//                    this.style.display = "inline";
//                })
            //==================================================================




            .text(function (d) {

                //If node is a logic node returns additional information
                return d.logic !== "" ? d.policyID + ":" + d.name : d.name;

            });




    //Selecting all texts of the circles
    var node = svg.selectAll("circle,text");

    d3.select("#container")
            .style("background", "white")
            .on("click", function () {
                zoom(root);
            });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    //This is the function that handles the zoo.
    function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", function (d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function (t) {
                        zoomTo(i(t));
                    };
                });

        transition.selectAll("text")
                .filter(function (d) {
                    return d.parent === focus || d === focus || this.style.display === "inline";
                })




                //=======================================================
                .style("fill-opacity", function (d) {
                    //return (d.parent === focus || d === focus) ? 1 : 0;
                    if (d.attribute === true && (d.parent !== focus)) {
                        return 0;
                    } else
                        return 1;
                })



                .each("start", function (d) {
                    if (d.parent === focus || d === focus)
                        this.style.display = "inline";
                })
                .each("end", function (d) {
//                    if (d.parent !== focus )
//                        this.style.display = "none";
                    //Show labels at all leves except attributes when zoomed
//                if (d.attribute === true && (d.parent !== focus)) {
//                    this.style.display = "none";
//                } else
//                    this.style.display = "inline";
                });
        //=======================================================





    }


    //Function zoom to a place clicked
    function zoomTo(v) {
        var k = diameter / v[2];
        view = v;

        //Transformations while zooming node
        node.attr("transform", function (d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });

        //Transformations while zooming circle
        circle.attr("r", function (d) {
            return d.r * k;
        });

        //Transformations while zooming text
        text.attr("dy", function (d) {

            //Moves the initial text labels to the top of the circle
            //If the element has logic
            return (d.attribute) ? 0 : (-d.r * k) + 12;
        });
    }
};