let data;
let barchart;


// load data from CSV file asynchronously and render charts
d3.csv('data/Global Deaths Dieases dataset_v2.csv').then(_data => {
    data = _data;

    /*restructures data i.e. 
    * count: 1402 
    * disease: "alzheimers"
    * year: 2007
    */

    data = data.map(d => ({
        year: +d['year'],
        disease: 'Alzheimers',
        count: +d['alzheimer\'s_diesease']
      })).concat(
        data.map(d => ({
          year: +d['year'],
          disease: 'Parkinsons',
          count: +d['parkinson\'s_disease']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'Malaria',
          count: +d['malaria']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'Cardiovascular Disease',
          count: +d['cardiovascular_diseases']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'HIV/AIDS',
          count: +d['hiv/aids']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'Tuberculosis',
          count: +d['tuberculosis']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'Diabetes',
          count: +d['diabetes_mellitus']
        }))
      );
    const scale_color = d3.scaleOrdinal(d3.schemeSet1)
    .domain(data.map(d=>d.year));
    barchart = new BarChart({parentElement: '#barchart'}, data,scale_color);
    barchart.updateVis();

}).catch(error => console.error(error));

