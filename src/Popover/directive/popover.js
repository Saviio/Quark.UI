import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'

export default class Popover{
    constructor(utils,$compile){
        this.restrict='EA'
        this.replace=true
        this.scope={
            placement:'@',
            title:'@'
        }
        this.transclude=true
        this.template=template
        this.utils=utils
        this.controller.$inject=['$scope']
        this.$compile=$compile
    }

    controller($scope){

    }

    link(scope,elem,attr,ctrl,transcludeFn){
        var linkedClone = transcludeFn()
        console.log(linkedClone)
        for(var i=linkedClone.length-1;i>=0;i--){
            var node=linkedClone[i]
            console.log(node)
        }
        ctrl.placement=scope.placement || 'top'
        console.log(scope)

        let tmpl=popoverTmpl.replace(/#{dire}/,ctrl.placement)
        let content=this.$compile(tmpl,transcludeFn)(scope)
        elem.append(content)

        const show = () =>{}
        const hide = () =>{}

        console.log(content)
        //*/
    }
}

Popover.$inject=["fermi.Utils","$compile"]
