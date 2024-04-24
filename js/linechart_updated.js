
class lineChart {
    /** 
     * class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     * @param {d3.Scale}
     * @param {d3.Dispatcher}
     * @param {d3.Scale} _colorScale 
    */
    constructor(_config, _data, _colorScale, _dispatcher) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 960,
            containerHeight: _config.containerHeight || 600,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 50},
        };
        this.data = _data;
        this.colorScale = _colorScale;
        this.dispatcher = _dispatcher || null;

        this.initVis();
    }
    
    /**
     * initialize the scales and axes and add svg and g elements
     * and text elements for the visualization
    */
    initVis() {
        let vis = this;
        
        // calculate inner chart size; margin specifies the space around the actual chart
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // add the svg element and define the size of drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .attr('id', 'linechart');;

        // add group element that will contain the actual chart
        // adjust the position according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

         vis.xScale = d3.scaleTime()
             .range([0, vis.width])
        

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);
           // .tickFormat(d3.timeFormat('%Y'));

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(4)
            .tickSizeOuter(0);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');
        
        // add axis title for Y
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', -vis.height / 2)
            .attr('y', 10)
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .text('Diseases');

        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', vis.width / 2)
            .attr('y', vis.height + 40)
            .style('text-anchor', 'middle')
            .text('Time');
    }

    /**
     * prepare and update the data and scales before we render the chart
    */
    updateVis() {
        let vis = this;
        let starting_date = new Date(2000,1,1)
        let end_date = new Date(2020,1,1)
        let loop_year;
        // set the filter for years 2000 - 2020
        
        const filteredData = vis.data.filter(d => d.year >= 2000 && d.year <= 2020);
        
        // group the data by year
        const yearData = d3.group(filteredData, d => d.year);
        console.log(yearData)
        //calculates the average count for each disease
        

        const aggregatedData = Array.from(yearData, ([year, data]) => {
            // Calculate average count for each disease for the current year
            const diseaseCount = d3.rollup(data, v => d3.mean(v, d => d.count), d => d.disease);
            loop_year = new Date(year, 1,1)
            // Convert rollup result to an array of objects with disease, year, and count
            return Array.from(diseaseCount, ([disease, count]) => ({
                disease: disease,
                year: loop_year,
                count: count
            }));
        });

        vis.aggregatedData = aggregatedData.flat();

        vis.colorValue = d => d.key;
        
        vis.xValue = d => d.year;

        //sets the y value for each bar to the average count
        vis.yValue = d => d.count;
    
    
        //sets domain for both axis
        vis.xScale.domain([starting_date, end_date]);
        vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);

        

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
       
        
        
        vis.renderVis();
    }
    
    /**
     * bind data to visual elements
     */
    renderVis() {
        let vis = this;

        const line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)));
        
        const nestedData = d3.group(vis.aggregatedData, d => d.disease);

        const lines = vis.chart.selectAll('.line')
            .data(Array.from(nestedData), d => d[0]);
        
        // we can use this for when we set up data filtering
        lines.exit().remove();

        // lines.enter().append('path')
        //     .attr('class', 'line')
        //     .attr('d', line)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'steelblue')
        //     .attr('stroke-width', 2);


        lines.enter().append('path')
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', d => vis.colorScale(d[0])) // Assuming colorScale is defined elsewhere
            .attr('stroke-width', 2)
            .merge(lines) // Merge enter and update selections
            .attr('d', d => line(d[1])); // Generate line path for each disease
            
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}