// SVG wrapper width and height
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
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
var xLabel = "Poverty";
var yLabel = "Healthcare";

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

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(stateGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  stateGroup.transition()
    .duration(1000)
    .attr("transform", function(d, i) {
      console.log(`State: ${i} ${d.state}`);
      console.log(`translate(${newXScale(d[chosenXAxis])},${newYScale(d[chosenYAxis])})`);
      return `translate(${newXScale(d[chosenXAxis])},${newYScale(d[chosenYAxis])})`;
    })

  return stateGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, stateGroup) {

  var xLabel;
  var yLabel;

  switch(chosenXAxis) {
    case "income":
      xLabel = "Income";
      break;
    case "age":
      xLabel = "Age";
      break;
    default:
      xLabel = "Poverty";
  };

  switch(chosenYAxis) {
    case "obesity":
      yLabel = "Obesity";
      break;
    case "smokes":
      yLabel = "Smokes";
      break;
    default:
      yLabel = "Healthcare";
  };
  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([45, -75])
    .html(function(d) {
      return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}%<br>${yLabel}: ${d[chosenYAxis]}%`);
    });

    stateGroup.call(toolTip);

  return stateGroup;
}

d3.csv("assets/data/data.csv").then(function(censusData) {
  console.log(censusData)

  // Parse Data/Cast as numbers
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // Create scale functions
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  console.log([censusData]);

  // Setup the tool tip.  
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([45, -75])
    .html(function(d) {
      return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}%<br>${yLabel}: ${d[chosenYAxis]}}%`);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create element group for both circle and text
  var stateGroup = chartGroup.selectAll('g')
    .data(censusData)
    .enter()
    .append("g")
    //.attr("transform", d => `translate(${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`);
    .attr("transform", function(d, i) {
      console.log(`State: ${i} ${d.state}`);
      console.log(`translate(${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`);
      return `translate(${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`;
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

  // Create group for three x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .classed("aText", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Age (Median)");
  
  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Household Income (Median)");

  // Create group for three y-axis labels
  var yLabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2));
  
  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Smokes (Median)");
  
  var obesityLabel = yLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .text("Obese (Median)");

  // updateToolTip
  var statesGroup = updateToolTip(chosenXAxis, chosenYAxis, stateGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        stateGroup = renderCircles(stateGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        stateGroup = updateToolTip(chosenXAxis, chosenYAxis, stateGroup);

        // changes classes to change bold text
        switch(chosenXAxis) {
          case "income":
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "age":
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          default:
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
        };
      }
    });

  yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        stateGroup = renderCircles(stateGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        stateGroup = updateToolTip(chosenXAxis, chosenYAxis, stateGroup);

        // changes classes to change bold text
        switch(chosenYAxis) {
          case "obesity":
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "smokes":
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          default:
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
        };
      }
    });
  
}).catch(function(error) {
  console.log(error);
});