import React, {Component} from 'react'
import {Spin} from 'antd'
import {connect, actions} from 'mirrorx'
import ContentDetail from './../components/Content'

class ConnContent extends Component {
    componentDidMount() {
        const id = this.props.match.params.id
        actions.posts.getDetail(id)
    }

    render() {
        const {loading} = this.props.detail;
        return <Spin style={{width: '100%'}} delay={300} spinning={loading === 'loading'}>
            {
                <ContentDetail layout={this.props} detail={this.props.detail} {...this.props}/>
            }
        </Spin>

    }
}

export default connect(state => {
    return {
        detail: state.posts.detail,
        layout: state.app.layout
    }

})(ConnContent)

