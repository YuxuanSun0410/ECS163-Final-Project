d3.csv("data/employee_attrition.csv").then(data => {
  console.log(data);
  console.log("Number of rows:", data.length);
  console.log("Columns:", data.columns);

  console.log("Job Satisfaction values:", [...new Set(data.map(d => d["Job Satisfaction"]))]);
  console.log("Monthly Income range:", d3.extent(data, d => +d["Monthly Income"]));

  drawBarChart(data);
  drawSankey(data);
  drawScatterPlot(data);
});