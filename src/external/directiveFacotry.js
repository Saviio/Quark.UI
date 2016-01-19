import cache from '../utils/cache'
import { generateFermiId } from '../utils'


//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了些小技巧来保证开发体验是一致的，directive的controller方法会在运行时多传入一个或两个依赖。
//directive 流程： compile => controller => link
//可能在某些corner case可能会导致工作失常，尚在斟酌中。

const FermiIdenitifer = 'data-fermiId'
let _cache = new cache() //remark 考虑一下究竟是不是需要在DOM上tag，还是干脆以DOM为key做数据映射


export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args)
			/*for (let key in instance) {
				instance[key] = instance[key]
			}*/

			if (typeof instance.compile === 'function') {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args)
					let [$elem, ...restArgs] = compileArgs
					let postLink = compileOrg.apply(ins, compileArgs)
					let fmId = generateFermiId()
					_cache.add(fmId, ins)
					$elem.attr(FermiIdenitifer, fmId)

					return (...linkArgs) => {
						let [scope, $elem, ...restArgs] = linkArgs
						if(postLink !== undefined){
							postLink.apply(ins, linkArgs)
						}
						$elem.removeAttr(FermiIdenitifer)
						_cache.remove(fmId)
					}
				}
			} else if(typeof instance.link === 'function') {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let [scope, $elem, ...restArgs] = linkArgs
					let fmId = $elem.attr(FermiIdenitifer)
					let caller
					if(fmId !== undefined){
						caller = _cache.remove(fmId)
						$elem.removeAttr(FermiIdenitifer)
					} else {
						caller = new Directive(...args) //remark 更换了顺序，review
					}

					linkOrg.apply(caller, linkArgs)
				}
			}

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller
				instance.controller.$inject = instance.controller.$inject || ['$scope', '$element']


				if(instance.controller.$inject.indexOf('$scope') === -1){
					instance.controller.$inject = [
						...instance.controller.$inject , '$scope'
					]
				}

				if(instance.controller.$inject.indexOf('$element') === -1){
					instance.controller.$inject  = [
						...instance.controller.$inject , '$element'
					]
				}

				instance.controller = function (...controllerArgs) {
					let scopeIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$scope')
					let elemIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$element')
					let $elem = elemIndex !== -1 && elemIndex !== undefined && controllerArgs[elemIndex]

					let fmId = $elem.attr(FermiIdenitifer)
					let caller
					if(fmId !== undefined){
						caller = _cache.get(fmId)
					} else {
						caller = new Directive(...args)
						fmId = generateFermiId()
						_cache.add(fmId, caller)
						$elem.attr(FermiIdenitifer, fmId)
					}

					controllerOrg.apply(caller, controllerArgs)

					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}

					if(typeof instance.link !== 'function' && fmId !== undefined){
						$elem.removeAttr(FermiIdenitifer)
						_cache.remove(fmId)
					}
				}

				instance.controller.$inject = controllerOrg.$inject

			} else if(typeof instance.passing === 'function'){
				instance.controller = function (...controllerArgs){
					let [scope, $elem, ...restArgs] = controllerArgs
					let fmId = $elem.attr(FermiIdenitifer)
					let caller
					if(fmId !== undefined){
						caller = _cache.get(fmId)
					} else {
						caller = new Directive(...args)
						let id = generateFermiId()
						_cache.add(id, caller)
						$elem.attr(FermiIdenitifer, id)
					}

					instance.passing.apply(caller, [this])
				}

				instance.controller = () => {}
				instance.controller.$inject = ['$scope', '$element']
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

//DirectiveFactory.$inject = []
