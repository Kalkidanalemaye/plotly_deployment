
init();

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then(data => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]);
    buildBubble(sampleNames[0]);
    buildGauge(sampleNames[0]);
  })
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBubble(newSample);
  buildGauge(newSample);
};

function buildMetadata(sample) {
  d3.json("samples.json").then(data => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`)
    });
  });
};

function buildCharts(name) {
  d3.json('samples.json').then(data => {
    var sample = data.samples.filter(obj => obj.id == name)[0];
    console.log(sample);

    var barData = [
      {
        x: sample.sample_values.slice(0,10).reverse(),
        y: sample.otu_ids.slice(0,10).map(otuID => "OTU " + otuID).reverse(),
        type: 'bar',
        orientation: 'h'
      }
    ];

    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: {t:30, l:150}
    };

    Plotly.newPlot('bar',barData,barLayout);
  })
};

function buildBubble(name) {
  d3.json('samples.json').then(data => {
    var sample = data.samples.filter(obj => obj.id ==name)[0];

    var bubbleData = [
      {
        x: sample.sample_values,
        y: sample.otu_ids,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids,
          colorScale: 'Earth'
        }
      }
    ];

    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
      margin: {t:30}
    };

    Plotly.newPlot('bubble',bubbleData, bubbleLayout);

  })
};
    
//References: http://quabr.com/53211506/calculating-adjusting-the-needle-in-gauge-chart-plotly-js
//https://com2m.de/blog/technology/gauge-charts-with-plotly/
//https://plotly.com/javascript/gauge-charts/

function buildGauge(sample){
  d3.json('samples.json').then(data => {
    var metadata = data.metadata;
    var washMetadata = metadata.filter(washObj => washObj.id == sample);
    var wFreq = washMetadata[0].wfreq;
    console.log(wFreq);
        
    // Washing frequency per week per participant
    var level = wFreq * 20;

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    
    // Path: may  have to change to create a better triangle
    var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var gaugeData = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 24, color:'850000'},
        showlegend: false,
        name:'times per week',
        text: wFreq,
        hoverinfo: 'text+name'},
      { values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
      rotation: 90,
      text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
      textinfo: 'text',
      textposition:'inside',
      direction: 'clockwise',
      marker: {
        colors:['#fcf2fa',
        '#fae6f5',
        '#f7d9f0',
        '#f5cceb',
        '#f2bfe6',
        '#f0b2e0',
       '#eda6db',
        '#eb99d6',
        '#e88cd1',
        '#ffffff'
      ]                   
      },
      
      labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var dataLayout = {
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week", font: { size: 20 } },
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    
    Plotly.newPlot('gauge', gaugeData, dataLayout);
  })
};
