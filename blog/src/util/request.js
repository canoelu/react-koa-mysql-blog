import axios from 'axios'
import {message} from 'antd'

const apiCache = {};
const CORS = [];

const fetch = (opt) => {
    const config = {
        baseURL: process.env.REACT_APP_BASE_URL,
        withCredentials: true // 允许携带cookie

    };
    if (apiCache.token) {
        config.headers = {'X-Access-Token': apiCache.token}
    }
    const _axios = axios.create(config);
    let {
        method = 'get',
        data,
        url
    } = opt;

    switch (method.toLowerCase()) {
        case 'get':
            return _axios.get(url, {
                params: data,
            });
        case 'delete':
            return _axios.delete(url, {
                params: data
            });
        case 'post':
            return _axios.post(url, data);
        case 'put':
            return _axios.put(url, data);
        case 'patch':
            return _axios.patch(url, data);
        default:
            return _axios(opt)
    }


};
const request = (opt) => {
    if (opt.url && opt.url.indexOf('//') > -1) {
        const origin = `${opt.url.split('//')[0]}//${opt.url.split('//')[1].split('/')[0]}`
        if (window.location.origin !== origin) {
            if (CORS && CORS.indexOf(origin) > -1) {
                opt.fetchType = 'CORS'
            } else {
                opt.fetchType = 'JSONP'
            }
        }
    }
    return fetch(opt).then(res => {
        const {statusText, status} = res;
        let data = opt.fetchType === 'YQL' ? res.data.query.results.json : res.data;
        // if (data instanceof Array) {
        //     data = {
        //         results: data,
        //     }
        // } else if (data instanceof Object && !data.results) {
        //     data = {
        //         result: data
        //     }
        // }
        return Promise.resolve({
            success: true,
            message: statusText,
            statusCode: status,
            ...data,
        })
    }).catch(err => {
        const {response} = err;
        let msg;
        let statusCode;
        if (response && response instanceof Object) {
            const {data, statusText} = response;
            statusCode = response.status;
            msg = data.msg || data.message || statusText
        } else {
            statusCode = 600;
            msg = err.message || 'Network Error'
        }
        if (!opt.quiet) {
            message.error(msg)
        }
        return Promise.reject({success: false, statusCode, message: msg})
    })

};

export {apiCache, request as default}
