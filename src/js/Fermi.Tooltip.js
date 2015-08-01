;(function(angular,undefined){
    //var elem = $event.currentTarget || $event.srcElement
    var tooltip= angular.module('Fermi.tooltip',['Fermi.core'])

    tooltip.directive('fermiTooltip',[function(){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            scope:{
                placement:'@',
                content:'@',
                offset:'@'
            },
            template:`
                <span ng-transclude ng-mouseenter="mouseenter($event)" ng-mouseleave="mouseleave($event)">
                </span>
            `,
            controller:['$scope','fermi.Utils',function($scope,utils){
                // tooltip-top
                //<div class="tooltip tooltip-on">

                var
                    container=null,
                    parent=null,
                    tooltip_tmpl=`

                            <div class="tooltip-arrow tooltip-arrow"></div>
                            <div class="tooltip-content">
                                <span>${$scope.content}</span>
                            </div>
                    `,
                    style=undefined,
                    placement=$scope.placement || 'top'

                var getContainer=function(){
                    if(!container){
                        container=document.createElement('div')
                        document.body.appendChild(container)
                        container=angular.element(container)
                        container.html(tooltip_tmpl)
                        container.addClass('tooltip tooltip-hidden')
                    }
                    return container
                }

                var setLocationStyle=function(){
                    var offset=$scope.offset || 6
                    var tooltip=getContainer()
                    if(typeof style!=='object'){
                        var {left,top}=utils.coords(parent)
                        var height=utils.style(parent,'height')
                        var width=utils.style(parent,'width')

                        var elem=tooltip[0]
                        var tp_height=parseInt(utils.style(elem,'height').replace(/px/,''))
                        var tp_width=parseInt(utils.style(elem,'width').replace(/px/,''))

                        switch(placement){
                            case 'top':style={
                                left:`${(left+width/2)-tp_width/2}px`,
                                top:`${top-tp_height-offset-9}px`
                            };break;
                            case 'bottom':style={
                                left:`${(left+width/2)-tp_width/2}px`,
                                top:`${top+height+offset}px`
                            };break;
                            case 'left':style={
                                left:`${left-tp_width-offset-4}px`,
                                top:`${(top+height/2)-tp_height/2}px`
                            };break;
                            case 'right':style={
                                left:`${left+width}px`,
                                top:`${(top+height/2)-tp_height/2}px`
                            };break;
                        }
                    }

                    tooltip.css('left',style.left)
                    tooltip.css('top',style.top)
                }



                $scope.mouseenter=function($event){
                    var elem = $event.currentTarget || $event.srcElement
                    if(!parent) parent = elem
                    var tooltip=getContainer()
                    tooltip.addClass(`tooltip-${placement}`)
                    setLocationStyle()
                    tooltip.removeClass('tooltip-hidden')

                }

                $scope.mouseleave=function($event){
                    var tooltip=getContainer()
                    tooltip.addClass('tooltip-hidden')
                }
            }]
        }
    }])

})(angular)


/*

<div>
    <div ng-class="{undefined:'tooltip-arrow tooltip-arrow-left',left: 'tooltip-arrow tooltip-arrow-left', right: 'tooltip-arrow tooltip-arrow-right',top:'tooltip-arrow tooltip-arrow-top',bottom:'tooltip-arrow tooltip-arrow-bottom'}[placement]"></div>
    <div>
        <span>{{content}}</span>
    </div>
</div>
*/
