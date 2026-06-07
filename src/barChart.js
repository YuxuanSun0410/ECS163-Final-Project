function drawBarChart(data) {
  const svg = d3.select("#bar-chart");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const margin = {
    top: 40,
    right: 30,
    bottom: 120,
    left: 70
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const grouped = d3.rollups(
    data,
    values => {
      const total = values.length;
      const left = values.filter(d => d.Attrition === "Left").length;

      return {
        total: total,
        left: left,
        attritionRate: left / total
      };
    },
    d => d["Job Role"]
  );

  const chartData = grouped.map(([jobRole, values]) => ({
    jobRole: jobRole,
    total: values.total,
    left: values.left,
    attritionRate: values.attritionRate
  }));

  chartData.sort((a, b) => d3.descending(a.attritionRate, b.attritionRate));

  const x = d3
    .scaleBand()
    .domain(chartData.map(d => d.jobRole))
    .range([0, innerWidth])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(chartData, d => d.attritionRate)])
    .nice()
    .range([innerHeight, 0]);

  g.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-35)")
    .style("text-anchor", "end");

  g.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

const tooltip = d3.select("body")
  .selectAll(".tooltip")
  .data([null])
  .join("div")
  .attr("class", "tooltip");

g.selectAll("rect")
  .data(chartData)
  .enter()
  .append("rect")
  .attr("x", d => x(d.jobRole))
  .attr("y", innerHeight)
  .attr("width", x.bandwidth())
  .attr("height", 0)
  .attr("fill", "#d95f5f")
  .attr("data-job-role", d => d.jobRole)
  .on("mouseover", function(event, d) {
    setSelectedJobRole(d.jobRole);
    d3.select(this).attr("fill", "#b84a4a");

    tooltip
      .style("opacity", 1)
      .html(
        `<strong>${d.jobRole}</strong><br>
        Attrition Rate: ${(d.attritionRate * 100).toFixed(1)}%<br>
        Left: ${d.left}<br>
        Total: ${d.total}`
      );
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", event.pageX + 12 + "px")
      .style("top", event.pageY - 28 + "px");
  })
  .on("mouseout", function() {
    d3.select(this).attr("fill", "#d95f5f");

    tooltip
      .style("opacity", 0);
      clearSelectedJobRole();
  })
  .transition()
  .duration(900)
  .attr("y", d => y(d.attritionRate))
  .attr("height", d => innerHeight - y(d.attritionRate));

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Attrition Rate by Job Role");

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 95)
    .attr("text-anchor", "middle")
    .text("Job Role");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Attrition Rate");
}