/**
 * Created by ben on 6/12/15.
 */
loggingApp.controller('logsController', function($scope, logsService, uiGridConstants){
    $scope.logFiles = [];
    $scope.logEntries = null;
    $scope.error = null;
    $scope.selectedFile = null;
    $scope.selectedEntry = null;
    $scope.viewTrace = true;
    $scope.viewDebug = true;
    $scope.viewInfo = true;
    $scope.viewWarning = true;
    $scope.viewError = true;
    $scope.viewFatal = true;

    $scope.gridOptions = {
        enableColumnResizing: true,
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        multiSelect: false,
        rowSelectionHeaderWidth: 35,
        paginationPageSizes: [100, 250, 500],
        paginationPageSize: 100,
        columnDefs: [
            {name: 'time', field: 'time', cellFilter: 'date:"MMMM dd, yyyy HH:mm:ss"', enableFiltering: false},
            {name: 'level', field: 'level', cellFilter: 'logLevelFilter', enableFiltering: false, filter: {
                noTerm: true,
                condition: function(term, cellvalue) {
                    return $scope.getLogLevelViewState(cellvalue);
                }
            },
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex){
                    var value = grid.getCellValue(row, col);
                    return $scope.getLogLevelCellClass(value);
                }},
            {name: 'message', field: 'msg', enableFiltering: false}
        ],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                $scope.selectedEntry = row.entity;
            });
        }
    };

    logsService.getLogFileNames().then(function(results){
        $scope.logFiles = results.files;
    }, function(error){
        $scope.error = error;
    });

    $scope.getLogFile = function(filename) {
        logsService.getLogFile(filename).then(function(result){
            $scope.gridOptions.data = result;

        }, function (error) {
            $scope.error = error;
        });
    };

    $scope.getLogLevelViewState = function(level) {
        switch(level) {
            case 10:
                return $scope.viewTrace;
            case 20:
                return $scope.viewDebug;
            case 30:
                return $scope.viewInfo;
            case 40:
                return $scope.viewWarning;
            case 50:
                return $scope.viewError;
            case 60:
                return $scope.viewFatal;
            default:
                return true;
        }
    };

    $scope.getLogLevelCellClass = function(level) {
        switch(level) {
            case 10:
                return 'logDefaultCell';
            case 20:
                return 'logDefaultCell';
            case 30:
                return 'logInfoCell';
            case 40:
                return 'logWarnCell';
            case 50:
                return 'logErrorCell';
            case 60:
                return 'logFatalCell';
            default:
                return 'logDefaultCell';
        }
    };

    $scope.onLogFiltersChanged = function(){
        if($scope.gridApi != null) {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
        }
    };
});