import React, {Component} from 'react'
import {
    Button, Table, Select,
    Popconfirm, Form, Input,
    DatePicker, Divider
} from 'antd'
import parseDate from './../util/parseDate'
import {Link, actions} from 'mirrorx'
import styled from 'styled-components'

const {Column} = Table;

const MLink = styled(Link)`
  margin: 0 10px
`

class ActionGroup extends Component {

    deleteClick = (e) => {
        actions.posts.resetList();

        // actions.posts.delPost(this.props.id)
    };

    render() {
        const {id} = this.props;
        return (
            <div>
                <MLink to={`/post/${id}`}>修改</MLink>
                <Popconfirm title={`确定要删除《${this.props.title}》?`} onConfirm={this.deleteClick}>
                    <a>删除</a>
                </Popconfirm>

            </div>
        )
    }
}

class ListTabel extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {data, status, current, total, size} = this.props;
        const  pageSize=Number(size)
        return <Table
            dataSource={data} loading={{spinning: status === 'loading', delay: 300}}
            rowKey="_id" pagination={{current, total, pageSize}} onChange={actions.posts.linkToList}
        >
            <Column title="文章id" dataIndex="_id"/>
            <Column title="文章标题" dataIndex="title"/>
            <Column title="文章描述" dataIndex="description"/>
            <Column title="文章更新时间" dataIndex="meta.createAt" render={(value) => (
                <span>{parseDate(value)}</span>
            )}/>

            <Column title="操作" key="action"
                    render={(text, item) => (
                        <ActionGroup onReject={this.rejectPost} id={item._id} title={item.title}/>
                    )}
            />
        </Table>
    }
}

export default ListTabel