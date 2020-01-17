// //to get all mpg values from our data
// cars.map(d => d.mpg)    // or cars.map(d => d["map"])
// //D3 functions
// let minmax = d3.extent(cars.map(d => d.mpg))
// let min = d3.min(cars.map(d => d.mpg))
// let max = d3.max(cars.map(d => d.mpg))

//adding a margin to the svg
let margin = {top: 5, bottom: 5, left: 50, right: 20 };
let svgWidth = 700;
let svgHeight = 500;
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// create svg for scatterplot to b at
let canvas = d3.select("body")
                .append("svg")
                .attr("id", "scatterplot")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                // .style('background-color', 'yellow')
                .append("g")
                  .attr('transform', "translate(" + margin.left + "," + margin.top + ")");

function cleanup_data(d) {
    // unmentioned variables remain unchanged
    d.mpg  =  +d.mpg
    d.cyl  =  +d.cyl
    d.disp =  +d.disp
    d.hp   =  +d.hp
    d.wt   =  +d.wt
    d.am   =  +d.am
    d.gear =  +d.gear
    return d
}


function draw (cars) {
/*
 *  S C A L E S
 */
//horizontal scale is disp
let dispscale = d3.scaleLinear()
  .domain(d3.extent(cars.map(d => d.disp)))
  .range([20, 570]); //remember the brackes! input is an array. this is a little less than the size of svg
//vertical scale scale is mpg
let mpgscale = d3.scaleLinear()
  .domain(d3.extent(cars.map(d => d.mpg)))
  .range([370, 20]); //backwards because 0,0 is at top left corner
//color scale
let colorscale = d3.scaleQuantize()
  .domain(d3.extent(cars.map(d => d.cyl)))
  .range(["RebeccaPurple", "RosyBrown", "Teal", "Salmon"]);
//size scale
let sizescale = d3.scaleSqrt()
  .domain(d3.extent(cars.map(d => d.wt)))
  .range([3, 30]);

// creating circles linked to our data
// d3.selectAll('svg#scatterplot')
let circles = canvas.selectAll('circle')
                    .data(cars) // include cars-data.js tho
                      .enter()
                      .append('circle')
                        .attr('cx', d => dispscale(d.disp)) // x axis scale
                        .attr('cy', d => mpgscale(d.mpg)) // y axis scale
                        .attr('r', d => sizescale(d.wt)) //size scale
                        .style('fill', d => colorscale(d.cyl)) //color scale
                        .style('opacity', 0.7)
                        .style('stroke', 'transparent');
/*
 *  A X I S
 */
// add axis (disp is horizontal, mpg is vertical)
let hAxis = d3.axisBottom()
              .scale(dispscale);
              // .attr("stroke-dasharray", "2,2");
let vAxis = d3.axisLeft()
              .scale(mpgscale)
              .ticks(7)
              .tickSize([-570]);
              // .attr("stroke-dasharray", "2,2");
//append g element for axis
canvas.append("g")
      .attr("transform", "translate(0,0)")
      .call(vAxis);
canvas.append("text")
      .attr("transform", "translate(-30,200)")
      .style("text-anchor", "middle")
      .text("mpg");

canvas.append("g")
      .attr("transform", "translate(0"+","+370+")")
      .call(hAxis);
canvas.append("text")
      .attr("transform", "translate(300,400)")
      .style("text-anchor", "middle")
      .text("disp");

//tickmarks
d3.selectAll('.tick')
      .select('line')
      .style("stroke-dasharray", "2,2");
 }


 d3.csv("cars-data.csv", cleanup_data).then(draw)
