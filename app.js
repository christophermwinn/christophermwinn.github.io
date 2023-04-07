// Construct the URL to fetch the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init(){ 

    // Fetch the json data from the url
    d3.json(url).then(function(buttondata){

        // Use D3 for dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        // Get names from json
        let names = buttondata.names;

        // Create the dropdown
        names.forEach(function(id){
            dropdownMenu.append("option").text(id).property("value");
        });
       
        // Call functions
        chartvalues(names[0]);
        metadata(names[0]);
    });
};
// Create function for changed id
function optionChanged(passedvalue) {

    chartvalues(passedvalue);
    metadata(passedvalue);
};

function chartvalues(passedvalue){

    // json data
    d3.json(url).then(function(buttondata){

        // Retrieve the samples data
        let samples = buttondata.samples;

        // Create filter
        let id = samples.filter(take=>take.id == passedvalue);

        // Retrieve chart data
        let sample_values = id[0].sample_values; 
        let otu_ids = id[0].otu_ids; 
        let otu_labels = id[0].otu_labels; 

        // Function for charts
        charts(sample_values, otu_ids, otu_labels);

    });
};
// Function for charts
function charts(sample_values, otu_ids, otu_labels){

    // json data
    d3.json(url).then(function(buttondata){
                
        // Data for bar chart
        let bar_data = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels,
            orientation: 'h'
        }];

        // Data for bubble chart
        let bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                color: otu_ids,
                colorscale: 'Jet',
                size: sample_values
            }
        }];
    
        // Formatting bar chart
        let bar_layout = {
            title: 'Bar Chart',
            height: 500,
            width: 400            
        };    

        // Formatting bubble chart
        let bubble_layout = {
            title: 'Bubble Chart',
            height: 550,
            width: 1000 
        };

        // Display bar and bubble charts
        Plotly.newPlot('bar', bar_data, bar_layout);
        Plotly.newPlot('bubble', bubble_data, bubble_layout);

    });
};
function metadata(passedvalue){

    // json data
    d3.json(url).then(function(buttondata){

        // Retrieve samples data
        let samples = buttondata.metadata;

        // Filter data from metadata
        let id = samples.filter(take=>take.id == passedvalue);

        let sample_metadata = d3.select('#sample-metadata').html('');

        // Iterate through each key and value
        Object.entries(id[0]).forEach(([key, value]) => {
            
            // Display information
            sample_metadata.append("h5").text(`${key}: ${value}`);
        });
    });
};
init();