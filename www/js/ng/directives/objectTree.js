/**
 * Created by ben on 6/12/15.
 */
loggingApp.directive('objectTreeNode', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parent: '='
        },
        link: function(scope, element, attrs){
            if(scope.parent != null && typeof scope.parent === 'object') {
                element.append('<object-tree root="parent"></object-tree>');
                $compile(element.contents())(scope);
            } else {
                element.append('<span class="logDetailsValue">{{parent}}</span>');
                $compile(element.contents())(scope);
            }
        }
    };
});

loggingApp.directive('objectTree', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            root: '='
        },
        template: '<ul><li ng-repeat="(key,value) in root" class="logDetailsKey">{{key}}:<object-tree-node parent="value"></object-tree-node></li></ul>'
    };
});