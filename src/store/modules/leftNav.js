import router from '@/router'
const state = {
    projectValue:''
}
const mutations = {
    SET_PROJECTVALUE:(state,projectValue) => {
        state.projectValue = projectValue
        if(projectValue == '自动化运维'){
            router.options.routes[1].hidden = false
            router.options.routes[0].hidden = true
            router.push('/auto-task/operation')
        }else if(projectValue == '智能监控'){
            router.options.routes[1].hidden = true
            router.options.routes[0].hidden = false
            router.push('/overview')
        }
        
    }
}
export default {
    state,
    mutations
  }
  