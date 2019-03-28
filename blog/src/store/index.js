import mirror, {actions} from 'mirrorx'
import './user'
import './login'
import './posts'
import {isListPath, history, getPageFromPath} from './../util'

const defaultAvatar = require('../asserts/avatar.png')


mirror.model({
    name: 'app',
    initialState: {
        bodyPaddingRight: 0,
        layout: {
            width: 1000,
            header: 52,
            left: 724,
            right: 266,
            padding: 16,
            margin: 10
        },
        currentPath: '',
        status: 'loading',
        defaultAvatar
    },
    reducers: {
        updateState(state, data) {
            return {
                ...state,
                ...data
            }
        }
    },
    effects: {
        routeChange({pathname, search}, getState) {
            const {updateState} = actions.app;
            updateState({
                currentPath: pathname
            })
            const names = ['posts']
            if (isListPath(pathname, names)) {
                const {name, page} = getPageFromPath(pathname, names)
                if (name === 'posts') {
                    const params = new URLSearchParams(search.slice(1))
                    const size = params.get('size') || 10
                    const tag = params.get('tag') || 'new'
                    actions.posts.updateList({size, tag})
                }
                if (page < 1) {
                    const state = getState()
                    const current = state[name].list.current
                    history.replace(`/${name}/list/${current < 1 ? 1 : current}`)
                } else {
                    console.log(page)
                    actions[name].updateList({current: page})
                    actions[name].getPostsList()
                }
            }
        },


    }
})

