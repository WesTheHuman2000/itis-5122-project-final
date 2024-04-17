class BarChart {
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
            .attr('height', vis.config.containerHeight);

        // add group element that will contain the actual chart
        // adjust the position according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.1);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);

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
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '0.71em')
            .text('Diseases');
    }

    /**
     * prepare and update the data and scales before we render the chart
    */
    updateVis() {
        let vis = this;
  
        //calculates the average count for each disease
        const diseaseCount = d3.rollup(vis.data, v => d3.mean(v, d => d.count), d => d.disease);

        vis.aggregatedData = Array.from(diseaseCount, ([key, count]) => ({ key, count }));
        vis.colorValue = d => d.key;
        //sets the x value for each bar to the disease name
        vis.xValue = d => d.key;

        //sets the y value for each bar to the average count
        vis.yValue = d => d.count;
    
    
        //sets domain for both axis
        vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
        vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);
    
        vis.renderVis();
    }
    
    /**
     * bind data to visual elements
     */
    renderVis() {
        let vis = this;
        const tooltip = d3.select('.div-tooltip').append('p');
        // add bars
        const bars = vis.chart.selectAll('.bar')
            .data(vis.aggregatedData)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(vis.xValue(d)))
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr('width', vis.xScale.bandwidth())
            .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
            .attr('fill', d => vis.colorScale(d.key))
            .on('mouseover', (event, d) => { 
                
                    console.log(d.key);
                    tooltip.text(d.key+ ": "+ d.count)
                
            })
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}