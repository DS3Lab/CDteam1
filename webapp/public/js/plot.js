function setupChart(qs, series, view_span, title, options) {
    let chart = new d3_tsline(qs + " > .chart", options);
    chart.parse_date = d3.time.format("%Y-%m-%d").parse;
    chart.parse_val = ((v) => parseInt(v));
    chart.series = {};
    for(let name in series) {
        let s = series[name];
        chart.series[name] = {
            name: s.name,
            active: s.active,
        };
    }
    chart.ref_series = Object.keys(series)[0];
    chart.view_span = view_span;
    for(let name in series) {
        chart.setSeriesData(name, series[name].data);
    }
    chart.render();
    document.querySelector(qs + " > .chart-title").innerText = title;
}

function plotAll(plots) {   
    let charts = document.querySelectorAll("#container > div");
    for(let i = 0; i < plots.length; i++) {
        console.log(JSON.stringify(plots[i], null, 2));
        setupChart("#" + charts[i].id, plots[i].series, plots[i].view_span, plots[i].title);
    }
}

function setupRealtime() {
    var chart = realTimeChart()
        .title("Chart Title")
        .yTitle("Y Scale")
        .xTitle("X Scale")
        .border(true)
        .width(600)
        .height(290)
        .barWidth(1);

    // invoke the chart
    var chartDiv = d3.select("#container").append("div")
    .attr("id", "chartDiv")
    .call(chart);

    function updateData() {
      var now = new Date(new Date().getTime());
      let obj = {
          // simple data item (simple black circle of constant size)
          time: now,
          color: "black",
          opacity: 1,
          value: 3,
          type: "circle",
          size: 5,
        };
      chart.datum(obj);
    }

    window.setInterval(updateData, 1000);
}

function updateRealtime() {
}

function canvasRealtime(id, title, maxDataLength) {
    var dps = [];
    maxDataLength = maxDataLength || 10;
    var chart = new CanvasJS.Chart(id, {
        title :{
            text: title,
        },
        axisY: {
            includeZero: false
        },      
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
    return {
        chart: chart,
        dps: dps,
        maxDataLength: maxDataLength,
    };
}

function canvasRealtimeUpdate(handle, dp) {
    handle.dps.push(dp);
    if(handle.dps.length > handle.maxDataLength) {
        handle.dps.shift();
    }
    handle.chart.render();
}