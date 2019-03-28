import mirrorx, {actions} from 'mirrorx'
import * as API from '../api'
import {apiCache} from './../util/request'

mirrorx.model({
    name: 'login',
    initialState: {
        status: 'waiting',
        loginModal: {
            show: false,
            type: 'login'
        },
        isReg: 'no'
    },
    reducers: {
        updateState(state, data) {
            return {
                ...state,
                ...data
            }
        },
        showModal(state, show) {
            return {
                ...state,
                loginModal: {...state.loginModal, show}
            }
        },
        setModalType(state, type) {
            return {
                ...state,
                loginModal: {...state.loginModal, type}

            }
        }

    },
    effects: {
        async login(params) {
            const {updateState, saveToken} = actions.login;
            try {
                const res = await API.login(params);
                const token = res.data.token;
                saveToken(token);
                updateState({
                    status: 'online'
                })
            } catch (e) {
                updateState({
                    status: 'offline'
                })
            }

        },
        saveToken(token) {
            apiCache.token = token;
            localStorage.setItem('token', token);
        },
        async getToken() {
            const {updateState} = actions.login
            const token = localStorage.getItem('token')
            if (!token) {
                updateState({status: 'offline'})
                return null
            } else {
                apiCache.token = token;
                updateState({status: 'online'})
            }


        },
        async register(params) {
            const {updateState} = actions.login;
            updateState({
                isReg: 'yes'
            });
            try {
                const res = await API.register(params);
                updateState({
                    isReg: 'success'
                })
            } catch (e) {
                updateState({
                    isReg: 'fail'
                })
            }

        }
    }
})