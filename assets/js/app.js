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
    data.age = +data.age;
  });

  console.log([censusData])

  // Create scale functions
  var xBuffer = 1;
  var yBuffer = 1;
  xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, data => data.poverty) - xBuffer, d3.max(censusData, data => data.poverty)])
    .range([0, width]);

  yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, data => data.age) - yBuffer, d3.max(censusData, data => data.age)])
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

  // Create element group for both circle and text
  var circleTextGroup = chartGroup.selectAll('g')
    .data(censusData)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${xLinearScale(d.poverty)},${yLinearScale(d.age)})`);

  // Create Circles
  circleTextGroup.append("circle")
    .classed("stateCircle", true)
    .attr("r", "15");

  // Add State abbreviations to circles
  circleTextGroup.append("text")
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
  .text("Poverty %");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
  .attr("class", "aText")
  .text("Age (Median)");
}).catch(function(error) {
  console.log(error);
});