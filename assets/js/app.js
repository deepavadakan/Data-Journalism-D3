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

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scale
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(censusData, chosenYAxis) {
  // create scale
  yLinearScale = d3.scaleLinear()
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(stateGroup, newXScale, chosenXAxis) {

  stateGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, stateGroup) {

  var xLabel;
  var yLabel;

  switch(chosenXAxis) {
    case "income":
      xLabel = "Income:";
      break;
    case "age":
      xLabel = "Age:";
      break;
    default:
      xLabel = "Poverty:";
  }

  switch(chosenYAxis) {
    case "obesity":
      yLabel = "Obesity:";
      break;
    case "smokes":
      yLabel = "Smokes:";
      break;
    default:
      yLabel = "Healthcare:";
  }
  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([45, -75])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}%<br>${yLabel} ${d[chosenYAxis]}%`);
    });

    stateGroup.call(toolTip);

  return stateGroup;
}

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

  // Setup the tool tip.  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([45, -75])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create element group for both circle and text
  var stateGroup = chartGroup.selectAll('g')
    .data(censusData)
    .enter()
    .append("g")
    //.attr("transform", d => `translate(${xLinearScale(d.poverty)},${yLinearScale(d.healthcare)})`);
    .attr("transform", function(d, i) {
      console.log(`State: ${i} ${d.state}`);
      console.log(`translate(${xLinearScale(d.poverty)},${yLinearScale(d.healthcare)})`);
      return `translate(${xLinearScale(d.poverty)},${yLinearScale(d.healthcare)})`;
    })
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);;

  // Create Circles
  stateGroup.append("circle")
    .classed("stateCircle", true)
    .attr("r", "15");

  // Add State abbreviations to circles
  stateGroup.append("text")
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