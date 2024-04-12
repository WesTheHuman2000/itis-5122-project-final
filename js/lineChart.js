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
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}), ${margin.right}`);


    d3.csv("data/updated_dataset_with_gdp_per_capita.csv").then(function (data) {
      console.log("Data from CSV:", data.slice(0, 5));
        const parseYear = d3.timeParse("%Y");
        const diseases = ['cardiovascular_diseases',
        'alzheimer\'s_diesease', 
        'parkinson\'s_disease',
        'malaria',
        'hiv/aids',
        'tuberculosis',
        'diabetes_mellitus'
      ];

        
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const diseaseTotals = diseases.map(disease => {
          const totalDeaths = data.reduce((sum, row) => sum + parseInt(row[disease] || 0), 0);
          return { disease, totalDeaths };
        });
        x.domain(d3.extent(data, d => parseYear(d.year)));
        y.domain([
          0,
          d3.max(data, (d) => d3.max(diseases, (disease) => d[disease])),
      ]);

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
        
        svg.append("g")
        .style("font-size", "14px")
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d => `${(d / 1000).toFixed(0)}k`)
            .tickSize(0)
            .tickPadding(10))
        .call(g => g.select(".domain").remove())
        .selectAll(".tick text")
        .attr("fill", "#777")
        .style("visibility", (d, i) => (i === 0 ? "hidden" : "visible"));
                //y
        diseases.forEach((disease, index) => {
          let lineFunc = d3.line()
              .x(d => x(d.year))
              .y(d => y(d[disease]));
  
          svg.append("path")
              .datum(data)
              .attr('fill', 'none')
              .attr("stroke", colorScale(index))
              .attr("stroke-width", 1)
              .attr("d", lineFunc);
      });
          
    })
        

       

        






