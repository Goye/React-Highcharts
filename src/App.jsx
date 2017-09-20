import React, { Component } from 'react';
import Highcharts from 'highcharts/highcharts.js';
import applyDrilldown from 'highcharts/modules/drilldown.js';
import './App.css';
applyDrilldown(Highcharts);

class App extends Component {

    componentDidMount() {
        Highcharts.chart('container', {
            chart: {
                type: 'pie',
                events: {
                    drilldown(e) {
                        if (!e.seriesOptions) {
                            // Show the loading label
                            const chart = this;
                            chart.showLoading("Loading ...");

                            const key = e.point.name;
                            App.fetchData(key).then(function(series) {
                                chart.hideLoading();
                                chart.addSeriesAsDrilldown(e.point, series);
                            });
                        }
                    }
                }
            },
            title: {
                text: 'Async drilldown'
            },
            subtitle: {
                text: 'Click the slices to view companies. Source: faker.js'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y}%'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}%</b> of total<br/>'
            },
            series: [{
                name: 'Companies',
                colorByPoint: true,
                data: [
                    {
                        name: "Apple",
                        y: 50,
                        drilldown: true
                    },
                    {
                        name: "Microsoft",
                        y: 10,
                        drilldown: true
                    },
                    {
                        name: "Xiaomi",
                        y: 40,
                        drilldown: true
                    }
                ]
            }],
            drilldown: {
                series: []
            }
        });
    }

    static async fetchData (dataKey) {
        const response = await fetch(`http://localhost:3000/data/${dataKey}`);
        const data = await response.json();
        return data;
    }

    render() {
        return (
            <div className="App">
                <h4>Demo</h4>
                <div id="container" style={{minWidth: 310, maxWidth: 600, height: 400, margin: '0 auto'}}>
                </div>
            </div>
        );
    }
}

export default App;
