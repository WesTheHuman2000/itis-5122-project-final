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
        //calculates sum by year and disease
        let diseaseByYear = Array.from(d3.rollup(data, v => d3.sum(v, d => d.cardiovascular_diseases), d => d.year))

        //sorts by year in ascending order
        diseaseByYear.sort((a, b) => a[0] - b[0]);
        diseaseByYear = diseaseByYear.slice(1)

        console.log(diseaseByYear)

        data.forEach(d => {
        d.year = parseYear(d.year);
        d.cardiovascular_diseases = total;
        });

x.domain(d3.extent(diseaseByYear, d => d[0]));
y.domain(d3.extent(diseaseByYear, d => d[1]));

svg.append("g")
.attr("transform", `translate(0,${height})`)
.style("font-size", "14px")
.call(d3.axisBottom(x)
        .tickValues(x.ticks(d3.timeYear))
        .tickFormat(d3.timeFormat("%Y")));


svg.append("g")
    .call(d3.axisLeft(y));
    

var lineFunc = d3.line()
      .x(d => x(d[0]))
      .y(d => y(d[1]));

svg.append("path")
      .datum(diseaseByYear)
      .attr('fill','none')
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", lineFunc(diseaseByYear));
      
    })
