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
        const total = d3.sum(data, d => d.cardiovascular_diseases);
        let diseaseByYear = d3.rollup(data, v => d3.sum(v, d => d.cardiovascular_diseases), d => d.year)

        console.log(diseaseByYear)
        data.forEach(d => {
        d.year = parseYear(d.year);
        d.cardiovascular_diseases = total;
        });

x.domain(d3.extent(data, d => d.year));
y.domain(d3.extent(data, d => d.cardiovascular_diseases));

svg.append("g")
.attr("transform", `translate(0,${height})`)
.style("font-size", "14px")
.call(d3.axisBottom(x)
        .tickValues(x.ticks(d3.timeYear))
        .tickFormat(d3.timeFormat("%Y")));


svg.append("g")
    .call(d3.axisLeft(y));
    

const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.cardiovascular_diseases));

svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", line);
      
    })
