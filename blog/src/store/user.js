import mirrorx, {actions} from 'mirrorx'
import * as API from './../api'

mirrorx.model({
    name: 'user',
    initialState: {
        status: 'waiting'
    },
    reducers: {
        updateState(state, data) {
            return {
                ...state, ...data
            }
        }
    },
    effects: {
        async getUserInfo(id, getState) {
            let user = API.getUserInfo();
            console.log(user)
        }
    }
})