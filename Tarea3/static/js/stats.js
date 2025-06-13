document.addEventListener('DOMContentLoaded', function() {
    const chart = Highcharts.chart('grafico1', {
        chart: {
            type: 'line',
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Actividades por Día',
            style: {
                fontSize: '1.5em',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: 'Cantidad de actividades creadas diariamente'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Fecha',
                style: {
                    fontWeight: 'bold'
                }
            },
            labels: {
                formatter: function() {
                    return Highcharts.dateFormat('%e %b %Y', this.value);
                }
            }
        },
        yAxis: {
            title: {
                text: 'Cantidad de Actividades',
                style: {
                    fontWeight: 'bold'
                }
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{point.x:%A, %e %b %Y}</b><br/>',
            pointFormat: 'Actividades: <b>{point.y}</b>'
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: true,
                    radius: 4
                },
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidth: 4
                    }
                }
            }
        },
        series: [{
            name: 'Actividades',
            data: [],
            color: '#4CAF50'
        }],
        credits: {
            enabled: false
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 600
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });

    const chart2 = Highcharts.chart('grafico2', {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Actividades por Tipo',
            style: {
                fontSize: '1.5em',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: 'Distribución absoluta de actividades por tipo'
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b><br/>' +
                        'Cantidad: <b>{point.y}</b>' 
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br/>{point.y}', 
                    style: {
                        fontSize: '12px'
                    },
                    distance: -30
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Actividades',
            colorByPoint: true,
            data: []
        }],
        credits: {
            enabled: false
        }
    });

    const chart3 = Highcharts.chart('grafico3', {
        chart: {
            type: 'column',
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Actividades por Bloque Horario',
            style: {
                fontSize: '1.5em',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: 'Mañana, Mediodía y Tarde agrupado por mes'
        },
        xAxis: {
            categories: [],
            title: {
                text: 'Mes'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidad de Actividades'
            },
            stackLabels: {
                enabled: false
            }
        },
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'
        },
        plotOptions: {
            column: {
                grouping: true,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [
            { name: 'Mañana', data: [], color: '#FFC107' },
            { name: 'Mediodía', data: [], color: '#03A9F4' },
            { name: 'Tarde', data: [], color: '#8BC34A' }
        ],
        credits: {
            enabled: false
        }
    });

    function processData(apiData) {
        return apiData.map(item => {
            const dateParts = item.date.split('-');
            const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            return {
                x: date.getTime(),
                y: item.count
            };
        });
    }

    function processPieData(apiData) {
        return apiData.map(item => {
            return {
                name: item.name,
                y: item.y
            };
        });
    }

    fetch('/get-activities-by-day')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(data => {
            const seriesData = processData(data);
            chart.series[0].setData(seriesData);
            chart.hideLoading();
        })
        .catch(error => {
            console.error('Error:', error);
            chart.hideLoading();
            chart.renderer.label('Error al cargar los datos', 100, 100)
                .css({
                    color: '#FF0000',
                    fontSize: '16px',
                    fontWeight: 'bold'
                })
                .add();
        });

    fetch('/api/activities-by-type')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener datos por tipo');
            return response.json();
        })
        .then(data => {
            chart2.series[0].setData(processPieData(data));
            chart2.hideLoading();
        })
        .catch(error => {
            console.error('Error:', error);
            chart2.hideLoading();
            chart2.renderer.label('Error al cargar los datos', 100, 100)
                .css({
                    color: '#FF0000',
                    fontSize: '16px',
                    fontWeight: 'bold'
                })
                .add();
        });
    
    fetch('/api/activities-by-time-block')
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener actividades por horario');
        return response.json();
    })
    .then(data => {
        const categories = data.map(item => item.month);
        const manana = data.map(item => item.mañana);
        const mediodia = data.map(item => item.mediodia);
        const tarde = data.map(item => item.tarde);

        chart3.xAxis[0].setCategories(categories);
        chart3.series[0].setData(manana);
        chart3.series[1].setData(mediodia);
        chart3.series[2].setData(tarde);
    })
    .catch(error => {
        console.error('Error:', error);
        chart3.renderer.label('Error al cargar los datos', 100, 100)
            .css({
                color: '#FF0000',
                fontSize: '16px',
                fontWeight: 'bold'
            })
            .add();
    });
    
});