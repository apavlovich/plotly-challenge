//Belly Button Biodiversity

//read in data
var data = d3.json("data/samples.json").then((data) => {
    console.log(data)
    
    var sampleNames = data.names;
    
    sampleNames.forEach((sample) => {
    d3.select("#selDataset").append("option").text(sample).property("value", sample);
    });

//default plots

    function init() {

        defaultDataset = data.samples[0];

        allSampleValuesDefault = defaultDataset.sample_values;
        allOtuIdsDefault = defaultDataset.otu_ids;
        allOtuLabelsDefault = defaultDataset.otu_labels;

         // BAR CHART 

        default_sampleValues = allSampleValuesDefault.slice(0,10);
        default_otu_ids = allOtuIdsDefault.slice(0,10);
        default_otu_labels = allOtuLabelsDefault.slice(0,10);

        trace1 = [{
        type: 'bar',
        x: default_sampleValues,
        y: default_otu_ids.map(default_otu_ids => `OTU ${default_otu_ids}`),
        text: default_otu_labels,
        orientation: 'h',
        }];

        var barData = trace1;
        
        var barLayout = {
            title: `<b>Top 10 Bacteria Cultures Found`,
            xaxis: {title: "Sample Value"},
            yaxis: {autorange: "reversed"},
        }

        var config = {responsive: true}

        Plotly.newPlot('bar', barData, barLayout, config);

         // BUBBLE CHART 

        var trace2 = [{
            x: allOtuIdsDefault,
            y: allSampleValuesDefault,
            text: allOtuLabelsDefault,
            mode: 'markers',
            marker: {
            color: allOtuIdsDefault,
            size: allSampleValuesDefault
        }
        }];

        var bubbleData = trace2
        
        var bubbleLayout = {
            title: '<b>Bacteria Cultures Per Sample',
            xaxis: { title: "OTU ID"},
            yaxis: { title: "Sample Value"}, 
            showlegend: false,
        };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, config);
    
         // DEMOGRAPHICS TABLE 

        var defaultDemo = data.metadata[0];
        Object.entries(defaultDemo).forEach(
            ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key.toUpperCase()}: ${value}`)
        );

         // GAUGE CHART 

        var defaultWfreq = defaultDemo.wfreq

        var trace3 = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: defaultWfreq,
                title: { text: '<b> Belly Button Washing Frequency </b> <br>Scrubs per Week'},
                type: "indicator",
                mode: "gauge+number",
                
                gauge: {
                        axis: {range: [null, 9]},
                        steps: [
                            { range: [0, 1], color: 'rgb(14, 77, 100)' },
                            { range: [1, 2], color: 'rgb(19, 113, 119)' },
                            { range: [2, 3], color: 'rgb(24, 137, 119)' },
                            { range: [3, 4], color: 'rgb(29, 154, 108)' },
                            { range: [4, 5], color: 'rgb(57, 169, 107)' },
                            { range: [5, 6], color: 'rgb(86, 184, 112)' },
                            { range: [6, 7], color: 'rgb(153, 212, 146)' },
                            { range: [7, 8], color: 'rgb(191, 225, 176)' },
                            { range: [8, 9], color: 'rgb(222, 237, 207)' },
                        ]
                    }
                }
        ];

        var gaugeData=trace3;

        var config = {responsive: true}

        var guageLayout = {margin: {t:0, b:0}};

        Plotly.newPlot('gauge', gaugeData, guageLayout, config);

        d3.select("#selDataset").on("change", updatePlotly);
    };

//updatePlotly

        function updatePlotly() {

            var dropdownMenu = d3.select("#selDataset").node();

            var inputValue = dropdownMenu.value;
            console.log(inputValue);

            dataset = data.samples.filter(sample => sample.id === inputValue) [0];

            allSampleValues = dataset.sample_values;
            allOtuIds = dataset.otu_ids;
            allOtuLabels = dataset.otu_labels;

              // RESTYLE BAR CHART 
            top10Values = allSampleValues.slice(0,10);
            top10Ids = allOtuIds.slice(0,10).map(default_otu_ids => `OTU ${default_otu_ids}`);
            top10Labels = allOtuLabels.slice(0,10);

            Plotly.restyle("bar", "x", [top10Values]);
            Plotly.restyle("bar", "y", [top10Ids]);
            Plotly.restyle["bar", "text", [top10Labels]];

               // RESTYLE BUBBLE CHART 
            Plotly.restyle("bubble", "x", [allOtuIds]);
            Plotly.restyle("bubble", "y", [allSampleValues]);
            Plotly.restyle("bubble", "text", [allOtuLabels]);

               // RESTYLE DEMOGRAPHICS TABLE 
            var allDemo = data.metadata.filter(sample => sample.id == inputValue)[0];
            console.log(allDemo);

            d3.select("#sample-metadata").html(""); 

            Object.entries(allDemo).forEach( 
            ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key.toUpperCase()}: ${value}`)
        ); 
              // RESTYLE GAUGE CHART 
            var newGauge = allDemo.wfreq;

            Plotly.restyle("gauge", "value", [newGauge])
            
        };

        init();
    
    });