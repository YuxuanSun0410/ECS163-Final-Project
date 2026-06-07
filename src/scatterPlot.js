function drawScatterPlot(data) {
  const svg = d3.select("#scatter-plot");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const margin = {
    top: 50,
    right: 140,
    bottom: 70,
    left: 90
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const satisfactionMap = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Very High": 4
  };

  data.forEach(d => {
    d.monthlyIncome = +d["Monthly Income"];
    d.satisfactionScore = satisfactionMap[d["Job Satisfaction"]];
  });

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.monthlyIncome))
    .nice()
    .range([0, innerWidth]);

  const y = d3
    .scaleLinear()
    .domain([0.5, 4.5])
    .range([innerHeight, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(["Stayed", "Left"])
    .range(["#4c9f70", "#d95f5f"]);

  g.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(
      d3.axisLeft(y)
        .tickValues([1, 2, 3, 4])
        .tickFormat(d => {
          if (d === 1) return "Low";
          if (d === 2) return "Medium";
          if (d === 3) return "High";
          if (d === 4) return "Very High";
        })
    );

const tooltip = d3.select("body")
  .selectAll(".tooltip")
  .data([null])
  .join("div")
  .attr("class", "tooltip");

// Jitter makes the categorical satisfaction levels easier to see.
g.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => x(d.monthlyIncome))
  .attr("cy", d => y(d.satisfactionScore) + (Math.random() - 0.5) * 24)
  .attr("r", 3)
  .attr("fill", d => color(d.Attrition))
  .attr("data-job-role", d => d["Job Role"])
  .attr("opacity", 0.32)
  .on("mouseover", function(event, d) {
    d3.select(this)
      .attr("r", 7)
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.9);

    tooltip
      .style("opacity", 1)
      .html(
        `<strong>${d["Job Role"]}</strong><br>
        Monthly Income: $${d["Monthly Income"]}<br>
        Job Satisfaction: ${d["Job Satisfaction"]}<br>
        Attrition: ${d["Attrition"]}`
      );
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", event.pageX + 12 + "px")
      .style("top", event.pageY - 28 + "px");
  })
  .on("mouseout", function() {
    d3.select(this)
      .attr("r", 3)
      .attr("stroke", "none")
      .attr("opacity", 0.32);

    tooltip.style("opacity", 0);
  });

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Monthly Income vs. Job Satisfaction");

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 50)
    .attr("text-anchor", "middle")
    .text("Monthly Income");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .text("Job Satisfaction");

  const legend = g
    .append("g")
    .attr("transform", `translate(${innerWidth + 30}, 20)`);

  const legendData = ["Stayed", "Left"];

  legend
    .selectAll("circle")
    .data(legendData)
    .enter()
    .append("circle")
    .attr("cx", 0)
    .attr("cy", (d, i) => i * 25)
    .attr("r", 6)
    .attr("fill", d => color(d));

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", 15)
    .attr("y", (d, i) => i * 25 + 5)
    .text(d => d);
}