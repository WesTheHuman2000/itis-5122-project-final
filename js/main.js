let data;
let barchart;


// load data from CSV file asynchronously and render charts
d3.csv('/Global Deaths Dieases dataset_v2.csv').then(_data => {
    data = _data;

    /*restructures data i.e. 
    * count: 1402 
    * disease: "alzheimers"
    * year: 2007
    */

    data = data.map(d => ({
        year: +d['year'],
        disease: 'alzheimers',
        count: +d['alzheimer\'s_diesease']
      })).concat(
        data.map(d => ({
          year: +d['year'],
          disease: 'parkinsons',
          count: +d['parkinson\'s_disease']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'malaria',
          count: +d['malaria']
        })),
        data.map(d => ({
          year: +d['year'],
          disease: 'cardiovascular',
          count: +d['cardiovascular_diseases']
        }))
      );

    barchart = new BarChart({parentElement: '#barchart'}, data);
    barchart.updateVis();

}).catch(error => console.error(error));

