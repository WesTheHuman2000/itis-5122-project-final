const margin = {top: 70, right: 30, bottom: 40, left: 80};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime()
    .range([0, width]);

const y = d3.scaleTime()
    .range([height, 0]);

const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", width + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}), ${margin.right}`);


    d3.csv("updated_dataset_with_gdp_per_capita.csv").then(function (data) {
        const parseYear = d3.timeParse("%Y");
        let diseaseByYear = d3.rollup(data, v => d3.sum(v, d => d.cardiovascular_diseases), d => d.year)
        


        console.log(diseaseByYear)
        data.forEach(d => {
        d.year = parseYear(d.year);
        d.cardiovascular_diseases = diseaseByYear;
        });

x.domain(d3.extent(data, d => d.year));
y.domain(d3.extent(diseaseByYear));
//x axis
svg.append("g")
.attr("transform", `translate(0,${height})`)
.style("font-size", "14px")
.call(d3.axisBottom(x)
        .tickValues(x.ticks(d3.timeYear.every(4)))
        .tickFormat(d3.timeFormat("%Y")))
.call(g => g.select(".domain")) 
        .selectAll(".tick line") 
        .style("stroke-opacity", 0)
      svg.selectAll(".tick text")
        .attr("fill", "#777");
//y
svg.append("g")
    .style("font-size", "14px")
    .call(d3.axisLeft(y)
        .ticks((d3.max(data, d => d.cardiovascular_diseases) - 65000) / 5000)
        .tickFormat(d => {
      return `${(d / 1000).toFixed(0)}k`;
  })
  .tickSize(0)
  .tickPadding(10))
  .call(g => g.select(".domain")) 
  .selectAll(".tick text")
  .style("fill", "#777") 
  .style("visibility", (d, i, nodes) => {
    if (i === 0) {
      return "hidden"; 
    } else {
      return "visible"; 
    }
  });

const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(diseaseByYear));

svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", line);
      
    })
