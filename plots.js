
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
  })
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBubble(newSample);
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


  }

  )
}

