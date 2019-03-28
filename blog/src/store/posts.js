import mirror, {
    actions
} from 'mirrorx'
import * as API from './../api'
import findIndex from 'lodash/findIndex'

import {
    history
} from './../util'

mirror.model({
    name: 'posts',
    initialState: {
        list: {
            tagId: '',
            keyword: '',
            data: [],
            status: 'init',
            labelCount: 0,
            current: 1,
            total: 0,
            size: 10,
            tag: '',
            author: 0
        },

        tag: {
            status: false,
            list: []
        },
        detail: {
            loading: false,
            data: {}
        },
        form: {
            loading: false,
            title: '',
            label: '',
            description: '',
            content: '',
        }
    },
    reducers: {
        updateState(state, data) {
            return {
                ...state,
                ...data
            }
        },
        updateList(state, data) {
            return {
                ...state,
                list: {
                    ...state.list,
                    ...data
                }
            }
        },
        nextPage(state, data) {
            return {
                ...state,
                list: {
                    ...state.list,
                    current: state.list.current + 1
                }
            }
        },
        resetList(state, data) {
            return {
                ...state,
                list: {
                    data: [],
                    keyword: '',
                    status: 'init',
                    current: 1,
                    total: 0,
                    size: 10,
                    tag: '',
                    author: 0
                }
            }
        },
        appendData(state, data) {
            const result = []
            data.forEach(item => {
                if (findIndex(state.data, item) === -1) {
                    result.push(item)
                }
            })
            return {
                ...state,
                list: {
                    ...state.list,
                    data: state.list.data.concat(result)
                }
            }
        },
        updateForm(state, data) {
            return {
                ...state,
                form: {
                    ...state.form,
                    ...data
                }
            }
        },
        resetForm(state, data) {
            return {
                ...state,
                form: {
                    ...state.form,
                    title: '',
                    description: '',
                    label: '',
                    content: ''
                }
            }
        },
        updateDetail(state, data) {
            return {
                ...state,
                detail: {
                    ...state.detail,
                    ...data
                }
            }
        },
        updateTag(state, data) {
            return {
                ...state,
                tag: {
                    ...data,
                }
            }
        }
    },
    effects: {
        async submit({action, id, params}, getState) {
            const state = getState();
            const _params = {
                ...params
            };
            const content = _params.content;
            console.log(_params)
            _params.content = JSON.stringify(content);
            if (action === 'create') {
                await API.postArticle(_params)
            } else {
                _params.id = id;

                await API.updateArticle(_params)
            }
        },
        async getPostsList(data, getState) {
            const {
                current,
                size,
                tagId,
                total,
                keyword
            } = getState().posts.list;
            const {
                updateList,
                appendData
            } = actions.posts;
            updateList({
                status: 'loading'
            });
            try {
                const res = await API.getPostsList({
                    current,
                    size,
                    tagId,
                    keyword
                });
                if (res.data.length > 0) {
                    updateList({
                        total: res.count,
                    });
                    appendData(res.data);
                    if (size * current < res.count) {
                        updateList({
                            status: 'loaded',
                        })
                    } else {
                        updateList({
                            status: 'noMore',
                        })
                    }
                } else {
                    updateList({
                        status: 'noMore',
                    })
                }
            } catch (e) {
                updateList({
                    status: 'failed',
                })
            }


        },

        async delPost(id, getState) {
            await API.deletePost(id);
            actions.posts.getPostsList()
        },

        async getDetail(id, getState) {
            const {
                updateForm,
                resetForm,
                updateDetail
            } = actions.posts;
            resetForm();
            updateForm({loading: true,});
            updateDetail({loading: true,});

            let res;
            try {
                res = await API.getPost(id);
                updateForm({
                    loading: true,
                    form: {
                        ...res.data
                    }
                })
                updateDetail({
                    loading: false,
                    data: {
                        ...res.data
                    }
                })
            } finally {
                updateForm({
                    loading: false
                })
                updateDetail({
                    loading: false
                })
            }
            return res

        },

        async getTagList() {
            const {
                updateState,
                updateTag
            } = actions.posts;
            updateTag({
                status: 'loading'
            });
            const res = await API.getTags();
            updateTag({
                status: 'loaded',
                list: [{
                    name: '最新',
                    id: 'new'
                }].concat(res.data)
            })
        },
        async queryByName(data, getState) {
            const {
                updateState
            } = actions.posts;

        },
        linkToList(params, getState) {
            const list = {
                ...getState().posts.list
            };
            const {
                pageSize,
                tag,
                current
            } = params;
            if (params) {
                if (params.current) list.current = current;
                if (params.tag || params.tag === '') list.tag = tag;
                if (params.pageSize || params.pageSize === '') list.size = pageSize;
            }
            const uparams = new URLSearchParams();
            let path = `/posts/list/${list.current}`;
            uparams.set('tag', list.tag);
            uparams.set('size', list.size);
            actions.posts.updateList({
                current,
                tag,
                data: []
            })
            path += `?${uparams}`;
            history.push(path)
            actions.posts.getPostsList()
        }
    }

})