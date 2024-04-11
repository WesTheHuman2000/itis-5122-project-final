const margin = { top: 70, right: 40, bottom: 60, left: 175 }
const width = 660 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3.select('#bar-chart').append('svg')
    .attr("width", width+ margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("global-deaths-dieases-dataset_v2.csv").then(data =>{
    let neoplasmsTotal = 0;
    let cardi_total = 0;
    let respi_total = 0;
    data.forEach(d=>{
        d.cardiovascular_diseases,
        neoplasmsTotal += +d.neoplasms,
        d.chronic_respiratory_diseases
    })
    const neoplasmsAverage = neoplasmsTotal / data.length;
})


// country,
// code,
// year,
// meningitis,
// alzheimer's_diesease,
// parkinson's_disease,
// nutritional_deficiency,
// malaria,
// drowning,
// interpersonal_violence,
// maternal_disorders,
// hiv/aids,
// drug_use_disorders,
// tuberculosis,
// cardiovascular_diseases,
// lower_respiratory_infections,
// neonatal_disorders,
// alcohol_use_disorders,
// self_harm,
// exposure_to_forces_of_nature,
// diarrheal_diseases,
// environmental_heat_and_cold_exposure,
// neoplasms,
// conflict_and_terrorism,diabetes_mellitus,
// chronic_kidney_disease,
// poisonings,
// protein_energy_malnutrition,
// terrorism,road_injuries,
// chronic_respiratory_diseases,
// chronic_liver_diseases,
// digestive_diseases,
// fire_heat_hot_substance,
// acute_hepatitis,
// Total_deaths,
// Female_pct,
// Male_pct,
// Age_0to15,
// Age_16to40,
// Age_41to65,
// Age_gt65
