/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.96375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request-OP2-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OP3-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OverviewPage-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OP1-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OP2-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OverviewPage-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OP1-0"], "isController": false}, {"data": [0.97, 500, 1500, "HTTP Request-OverviewPage"], "isController": false}, {"data": [0.99, 500, 1500, "HTTP Request-OP3"], "isController": false}, {"data": [0.99, 500, 1500, "HTTP Request-OP1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OP2"], "isController": false}, {"data": [0.97, 500, 1500, "HTTP Request- T& C"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request- Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request- T& C-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request- T& C-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-OP3-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 0, 0.0, 287.78500000000037, 154, 1194, 206.0, 437.0, 703.8999999999999, 943.7400000000002, 24.307982133633132, 173.553413942147, 6.961245860046793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-OP2-1", 50, 0, 0.0, 185.54000000000002, 162, 309, 176.0, 217.9, 249.04999999999987, 309.0, 4.364906154517678, 42.83916684853776, 1.0059744652989961], "isController": false}, {"data": ["HTTP Request-OP3-0", 50, 0, 0.0, 172.90000000000003, 154, 310, 161.0, 202.8, 238.54999999999993, 310.0, 4.055478952064239, 2.5980412036661527, 0.8594130201151755], "isController": false}, {"data": ["HTTP Request-OverviewPage-0", 50, 0, 0.0, 195.57999999999996, 169, 312, 185.5, 245.5, 264.15, 312.0, 4.426345609065156, 2.550335848973088, 0.8083267860304533], "isController": false}, {"data": ["HTTP Request-OP1-1", 50, 0, 0.0, 189.48000000000005, 162, 313, 177.0, 233.7, 273.4499999999998, 313.0, 4.460303300624442, 43.77543766726137, 1.0279605263157894], "isController": false}, {"data": ["HTTP Request-OP2-0", 50, 0, 0.0, 196.76000000000002, 166, 306, 180.0, 253.1, 284.5499999999999, 306.0, 4.334633723450368, 2.7768747290853923, 0.9312689640225401], "isController": false}, {"data": ["HTTP Request-OverviewPage-1", 50, 0, 0.0, 196.14000000000001, 165, 364, 181.0, 230.7, 342.9999999999999, 364.0, 4.42556204637989, 43.43447125597451, 0.8773331009913259], "isController": false}, {"data": ["HTTP Request-OP1-0", 50, 0, 0.0, 192.23999999999998, 166, 275, 175.5, 256.6, 268.9, 275.0, 4.451963315822278, 2.852038999198647, 0.9564764936336925], "isController": false}, {"data": ["HTTP Request-OverviewPage", 50, 0, 0.0, 392.2199999999999, 335, 625, 378.0, 458.0, 596.6999999999998, 625.0, 4.356539165287096, 45.26716476431123, 1.659228783654265], "isController": false}, {"data": ["HTTP Request-OP3", 50, 0, 0.0, 355.74, 319, 593, 341.0, 408.7, 446.39999999999975, 593.0, 4.00192092204258, 41.84039589002722, 1.77038103289579], "isController": false}, {"data": ["HTTP Request-OP1", 50, 0, 0.0, 382.08000000000004, 332, 507, 366.5, 444.8, 478.7999999999999, 507.0, 4.38288920056101, 45.82344900508415, 1.9517553471248248], "isController": false}, {"data": ["HTTP Request-OP2", 50, 0, 0.0, 382.64000000000004, 328, 492, 368.5, 440.7, 485.59999999999997, 492.0, 4.27313904794462, 44.67600258524912, 1.9028822322878385], "isController": false}, {"data": ["HTTP Request- T& C", 50, 0, 0.0, 393.36, 333, 531, 384.5, 476.4, 508.74999999999994, 531.0, 4.4006336912515405, 46.00896904154198, 1.9596571906354514], "isController": false}, {"data": ["HTTP Request- Login Page", 50, 0, 0.0, 794.58, 653, 1194, 759.0, 959.1, 1012.55, 1194.0, 4.619364375461936, 45.33653513026608, 1.2179964661862528], "isController": false}, {"data": ["HTTP Request- T& C-1", 50, 0, 0.0, 192.04, 165, 346, 184.0, 230.9, 244.04999999999995, 346.0, 4.473472309206406, 43.90468428469178, 1.030995571262414], "isController": false}, {"data": ["HTTP Request- T& C-0", 50, 0, 0.0, 200.85999999999996, 165, 313, 185.5, 257.59999999999997, 308.9, 313.0, 4.477478284230322, 2.8683845258350495, 0.9619582251276082], "isController": false}, {"data": ["HTTP Request-OP3-1", 50, 0, 0.0, 182.40000000000003, 163, 425, 172.5, 204.89999999999998, 250.14999999999998, 425.0, 4.052192235999676, 39.77005075370776, 0.9339036793905503], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
