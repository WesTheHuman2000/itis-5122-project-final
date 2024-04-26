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
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 320,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 80},
        };
        this.data = _data;
        this.colorScale = _colorScale;
        this.dispatcher = _dispatcher || null;

        this.initVis();
    }
    
    handleBarClick(d) {
        // Dispatch an event with the selected disease
        this.dispatcher.call("diseaseClick", null, d.key);
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
            .attr('transform', `translate(0,${vis.height})`)

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');
        
        // add axis title for Y
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', -vis.height / 2)
            .attr('y', 10)
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .text('Average Yearly Count');

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

        //creates bar chart group
        const barchartG = vis.chart.append('g').attr('id','barchartG');
        
        //adds group for each bar
        const barGroups = barchartG.selectAll('g')
            .data(vis.aggregatedData)
            .join('g')
            .attr('id',d=>d.key)
            .attr('transform',d=>`translate(${vis.xScale(vis.xValue(d))}, 0)`);
        
        //appends p to div tooltip
        const tooltip = d3.select('.div-tooltip').append('p');

        // adds bars to each bar group
        barGroups.append('rect')
            .attr('class', 'bar')
            .attr('id', d => d.key)
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr('width', vis.xScale.bandwidth())
            .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
            .attr('fill', d => vis.colorScale(d.key))
            .on('mouseover', (e,d)=>{
                tooltip
                    .style('display','inline')
                    .style('position', 'absolute')
                    .style('left', `${e.pageX + 8}px`)
                    .style('top', `${e.pageY - 25}px`)
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
                    .text(d.key + ": "+ Math.round(d.count))
            })
            .on('mouseout', () => tooltip.style('display','none'))
            .on('click', (event, d) => this.handleBarClick(d));
           
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}