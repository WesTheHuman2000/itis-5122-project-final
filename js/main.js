let data;
let barchart;
let linechart

// load data from CSV file asynchronously and render charts
d3.csv('data/Global Deaths Dieases dataset_v2.csv').then(_data => {
    data = _data;

    /*restructures data i.e. 
    * count: 1402 
    * disease: "alzheimers"
    * year: 2007
    */

    data = data.flatMap(d => {
      const year = +d['year'];
      return [
        { year: year, disease: 'Cardiovascular Disease', count: +d['cardiovascular_diseases'] },
        { year: year, disease: 'Tuberculosis', count: +d['tuberculosis'] },
        { year: year, disease: 'HIV/AIDS', count: +d['hiv/aids'] },
        { year: year, disease: 'Alzheimers', count: +d['alzheimer\'s_diesease'] },
        { year: year, disease: 'Diabetes', count: +d['diabetes_mellitus'] },
        { year: year, disease: 'Malaria', count: +d['malaria'] },
        { year: year, disease: 'Parkinsons', count: +d['parkinson\'s_disease'] }
      ];
  });
    dispatcher = d3.dispatch("diseaseClick");
    const scale_color = d3.scaleOrdinal(d3.schemeSet1)
    .domain(data.map(d=>d.year));
    linechart = new lineChart({parentElement: '#lineChart'}, data, scale_color, dispatcher);
    linechart.updateVis();
    barchart = new BarChart({parentElement: '#barchart'}, data,scale_color, dispatcher);
    barchart.updateVis();

}).catch(error => console.error(error));

