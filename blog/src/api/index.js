import request from '../util/request'


const login = ({username, password}) => {
    return request({
        url: '/login',
        method: 'post',
        data: {username, password}
    })
};
const register = ({
                      username, password, avatar, moment
                  }) => {
    return request({
        method: 'post',
        url: '/register',
        data: {
            username, password,
            avatar, moment
        }
    })
};
const getPostsList = ({current, size, tagId, keyword}) => {
    return request({
        method: 'get',
        url: '/posts',
        data: {page: current, size, tagId, keyword}
    })
}
const getPostsByTag = ({page, size, tag}) => {
    return request({
        url: '/post?tag=:tag'
    })
}

const postArticle = (data) => {
    return request({
        method: 'post',
        url: '/post',
        data: data
    })
}
const deletePost = (id) => {
    return request({
        method: 'delete',
        url: `/post/${id}`,
    })
}

const getPost = (id) => {
    return request({
        method: 'get',
        url: `/post/${id}`,
    })
}

const getTags = () => {
    return request({
        url: '/tags'
    })
}
const updateArticle = (data) => {
    return request({
        method: 'put',
        url: '/post',
        data
    })
}
const findByName = (keyword) => {
    return request({
        method: 'get',
        url: '/query',
        data: {
            keyword
        }
    })
}

const getUserInfo = () => {
    return request({
        method: 'get',
        url: `/userInfo`,
    })
}

export {
    login, register, getPostsList, postArticle, deletePost, getPost, getTags, updateArticle, getUserInfo
}