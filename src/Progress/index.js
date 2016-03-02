import factory from '../external/componentFactory'
import line from './directive/line'
import query from './directive/query'
import loading from './service/loading'
import circle from './directive/circle'

import './css/line.scss'
import './css/query.scss'
import './css/loading.scss'
import './css/circle.scss'

const component = {
    namespace:'Fermi.progress',
    inject:[]
}
//.directive('fermiLoadingbar',factory.create(test))
export default angular.module(component.namespace, component.inject)
	.directive('fermiLine', factory.create(line))
    .directive('fermiQuery',factory.create(query))
    .directive('fermiCircle',factory.create(circle))
    .service('Fermi.Loading',loading)
	.name;
