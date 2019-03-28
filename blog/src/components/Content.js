import React, {Component} from 'react'
import {Icon} from 'antd'
import QuillDeltaToHtmlConverter from 'quill-delta-to-html'
import styled from 'styled-components'
import parseDate from './../util/parseDate'

const ContentWrap = styled.div`
    background-color:#f7f8f9
    
`
const DetailTile = styled.h1`
    padding:15px;
    text-align:center;
    font-size:40px
    
`
const Container=styled.div`
    width:${props => props.w}px;
     

    padding:20px;
    min-height:600px
    margin:0 auto;
   
`
const ContentInfo = styled.div`
    display:flex;
    justify-content:center;
    .author{
        margin: 0 100px;
    }
    .date{
        span{
            margin-left:5px
        }
    }
`
const ContentHtml = styled.div`
    display:flex;
    flex-direction:column;
    padding-top:20px;
`

class ContentDetail extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {detail, layout} = this.props
        const {width} = layout;
        const {content, title, author, meta} = detail.data;
        let htmlContent;
        if (!detail.loading && content) {
            const contentData = JSON.parse(content)
            const converter = new QuillDeltaToHtmlConverter(contentData.ops, {});

            htmlContent = converter.convert();
        }
        console.log(htmlContent)

        return <ContentWrap>
            <Container  w={width}>
                <DetailTile>{title}</DetailTile>
                <ContentInfo>
                    <span className='author'>作者：{author && author.username}</span>
                    <span className='date'>
                    <Icon type='clock-circle-o'/>
                    <span>{meta && parseDate(meta.createAt)}</span>
                </span>
                </ContentInfo>
                <ContentHtml w={width} dangerouslySetInnerHTML={{__html: htmlContent}}/>
            </Container>

        </ContentWrap>
    }
}

export default ContentDetail