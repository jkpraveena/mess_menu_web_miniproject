/**
 * Charts.js utility functions for the Mess Menu Formation System
 */

/**
 * Create a pie chart for displaying distribution data
 * @param {string} canvasId - Canvas element ID
 * @param {object} data - Data for the chart with labels and values
 * @param {string} title - Chart title
 * @param {string} position - Legend position (default: 'right')
 */
function createPieChart(canvasId, data, title, position = 'right') {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Define a color palette
    const backgroundColors = [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(201, 203, 207, 0.6)'
    ];
    
    const borderColors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(201, 203, 207, 1)'
    ];
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: backgroundColors.slice(0, data.labels.length),
                borderColor: borderColors.slice(0, data.labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: position,
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create a bar chart for displaying count data
 * @param {string} canvasId - Canvas element ID
 * @param {object} data - Data for the chart with labels and values
 * @param {string} title - Chart title
 * @param {string} yAxisLabel - Y-axis label text
 */
function createBarChart(canvasId, data, title, yAxisLabel) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: yAxisLabel,
                data: data.values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Create a line chart for displaying trend data
 * @param {string} canvasId - Canvas element ID
 * @param {object} data - Data for the chart with labels and datasets
 * @param {string} title - Chart title
 * @param {string} xAxisLabel - X-axis label text
 * @param {string} yAxisLabel - Y-axis label text
 */
function createLineChart(canvasId, data, title, xAxisLabel, yAxisLabel) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Define a color palette for multiple datasets
    const colors = [
        { borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' },
        { borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)' },
        { borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)' },
        { borderColor: 'rgba(255, 206, 86, 1)', backgroundColor: 'rgba(255, 206, 86, 0.2)' },
        { borderColor: 'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)' }
    ];
    
    // Format datasets with colors
    const formattedDatasets = data.datasets.map((dataset, index) => {
        const colorIndex = index % colors.length;
        return {
            label: dataset.label,
            data: dataset.data,
            borderColor: colors[colorIndex].borderColor,
            backgroundColor: colors[colorIndex].backgroundColor,
            borderWidth: 2,
            tension: 0.1
        };
    });
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: formattedDatasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xAxisLabel
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisLabel
                    }
                }
            }
        }
    });
}

/**
 * Update chart data dynamically
 * @param {Chart} chart - Chart.js chart instance
 * @param {object} newData - New data to update the chart with
 */
function updateChartData(chart, newData) {
    chart.data.labels = newData.labels;
    
    // If it's a simple chart with one dataset
    if (newData.values) {
        chart.data.datasets[0].data = newData.values;
    } 
    // If it has multiple datasets
    else if (newData.datasets) {
        chart.data.datasets = newData.datasets.map((dataset, index) => {
            // Preserve existing dataset properties like colors
            const existingDataset = chart.data.datasets[index] || {};
            return {
                ...existingDataset,
                label: dataset.label,
                data: dataset.data
            };
        });
    }
    
    chart.update();
}
