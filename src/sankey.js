function drawSankey(data) {
  const svg = d3.select("#sankey");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  // Set chart margins and drawing area.
  const margin = {
    top: 40,
    right: 30,
    bottom: 30,
    left: 30
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Limit to top job roles so the first Sankey is readable.
  const topRoles = Array.from(
    d3.rollups(data, v => v.length, d => d["Job Role"])
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, 5),
    d => d[0]
  );

  const filteredData = data.filter(d => topRoles.includes(d["Job Role"]));
  // Store unique nodes and combine repeated links.
  const nodeNames = new Set();
  const linksMap = new Map();

  function addLink(source, target, value) {
    nodeNames.add(source);
    nodeNames.add(target);

    const key = `${source} -> ${target}`;
    linksMap.set(key, {
      source: source,
      target: target,
      value: (linksMap.get(key)?.value || 0) + value
    });
  }
  // Build pathway links for each employee.
  filteredData.forEach(d => {
    const role = d["Job Role"];

    const income = +d["Monthly Income"];
    let incomeLevel;
    if (income < 5000) {
        incomeLevel = "Income: Low";
    } else if (income < 10000) {
        incomeLevel = "Income: Medium";
    } else {
        incomeLevel = "Income: High";
    }

    const overtime = `Overtime: ${d.Overtime}`;
    const satisfaction = `Satisfaction: ${d["Job Satisfaction"]}`;
    const outcome = d.Attrition;

    addLink("All Employees", role, 1);
    addLink(role, incomeLevel, 1);
    addLink(incomeLevel, overtime, 1);
    addLink(overtime, satisfaction, 1);
    addLink(satisfaction, outcome, 1);
    });
  // Build pathway links for each employee.
  const nodes = Array.from(nodeNames, name => ({ name }));

  const nodeIndex = new Map(nodes.map((d, i) => [d.name, i]));

  const links = Array.from(linksMap.values(), d => ({
    source: nodeIndex.get(d.source),
    target: nodeIndex.get(d.target),
    value: d.value
  }));
// Create Sankey layout.
  const sankey = d3.sankey()
    .nodeWidth(18)
    .nodePadding(18)
    .extent([[0, 0], [innerWidth, innerHeight]]);

  const graph = sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
// Use separate colors for stayed and left outcomes.
  const color = d3.scaleOrdinal()
    .domain(["Stayed", "Left"])
    .range(["#4c9f70", "#d95f5f"]);

  // Tooltip
  const tooltip = d3.select("body")
    .selectAll(".tooltip")
    .data([null])
    .join("div")
    .attr("class", "tooltip");


  // Links
  g.append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => {
      const targetName = d.target.name;
      if (targetName === "Left") return color("Left");
      if (targetName === "Stayed") return color("Stayed");
      return "#999";
    })
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("stroke-opacity", 0)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("stroke-opacity", 0.75);

      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d.source.name} → ${d.target.name}</strong><br>
          Count: ${d.value}
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", event.pageX + 12 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("stroke-opacity", 0.35);

      tooltip.style("opacity", 0);
    })
    .transition()
    .duration(900)
    .attr("stroke-opacity", 0.35);

  // Nodes
  const node = g.append("g")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g");

  node.append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => Math.max(1, d.y1 - d.y0))
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => {
      if (d.name === "Left") return color("Left");
      if (d.name === "Stayed") return color("Stayed");
      if (d.name.startsWith("Income")) return "#9c89b8";
      if (d.name.startsWith("Overtime")) return "#f0b35a";
      if (d.name.startsWith("Satisfaction")) return "#88bdbc";    
      if (d.name === "All Employees") return "#555";
      return "#6b8fb3";
    })
    .attr("opacity", 0.9)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("opacity", 1)
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5);

      tooltip
        .style("opacity", 1)
        .html(
          `<strong>${d.name}</strong><br>
          Employees: ${d.value}`
        );
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", event.pageX + 12 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("opacity", 0.9)
        .attr("stroke", "none");

      tooltip.style("opacity", 0);
    });

  node.append("text")
    .attr("x", d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y0 + d.y1) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < innerWidth / 2 ? "start" : "end")
    .attr("font-size", "12px")
    .text(d => d.name);

  // Title
  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Employee Attrition Pathways");

  }