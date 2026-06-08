// Load the employee attrition dataset and initialize all visualizations.
d3.csv("data/employee_attrition.csv").then(data => {
  console.log(data);
  console.log("Number of rows:", data.length);
  console.log("Columns:", data.columns);
// Check key data fields before drawing charts.
  console.log("Job Satisfaction values:", [...new Set(data.map(d => d["Job Satisfaction"]))]);
  console.log("Monthly Income range:", d3.extent(data, d => +d["Monthly Income"]));
// Draw the three coordinated visualizations used in the dashboard.
  drawBarChart(data);
  drawSankey(data);
  drawScatterPlot(data);
});
// Store the currently selected job role for linked highlighting.
let selectedJobRole = null;
// Highlight the selected job role across charts.
function setSelectedJobRole(jobRole) {
  selectedJobRole = jobRole;

  d3.selectAll("[data-job-role]")
    .attr("opacity", function() {
      const thisRole = d3.select(this).attr("data-job-role");
      return thisRole === jobRole ? 1 : 0.18;
    });
}
// Clear the linked highlighting.
function clearSelectedJobRole() {
  selectedJobRole = null;

  d3.selectAll("[data-job-role]")
    .attr("opacity", null);
}