// SVG wrapper width and height
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 50,
    right: 50,
    bottom: 60,
    left: 50
};


var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(censusData) {
  console.log(censusData)

  // Parse Data/Cast as numbers
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create scale functions
  var xBuffer = 1;
  var yBuffer = 1;
  xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) - xBuffer, d3.max(censusData, d => d.poverty) + xBuffer])
    .range([0, width]);

  yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare) - yBuffer, d3.max(censusData, d => d.healthcare) + yBuffer])
    .range([height, 0]);
  
  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  console.log([censusData]);


  // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .classed("stateCircle", true)
    .attr("r", "15");

  // Add State abbreviations to circles
  chartGroup.append("text")
    .data(censusData)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '15px')
    .attr("class", "stateText")
    .text(d => d.abbr);

  // Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "aText")
  .text("Lacks Healthcare (%)");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
  .attr("class", "aText")
  .text("In Poverty (%)");
}).catch(function(error) {
  console.log(error);
});