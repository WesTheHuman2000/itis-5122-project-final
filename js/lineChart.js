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


    d3.csv("updated_dataset_with_gdp_per_capita.csv").then(_data => {
        data = _data
        // Parse the date and convert the population to a number
        data.forEach(d => {
          d.year += d['year'];
          d.population += d['population'];
        });
    });

x.domain(d3.extent(dataset, d => d.date));
y.domain([0, d3.max(dataset, d => d.value)]);

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
    .ticks(d3.timeMonth.every(1)) 
    .tickFormat(d3.timeFormat("%b %Y"))); 

svg.append("g")
    .call(d3.axisLeft(y))


const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

svg.append("path")
      .datum(dataset)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", line);



