import React from 'react'
import ReactQuill, {Quill} from 'react-quill'
import {actions} from 'mirrorx'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'
import styled from 'styled-components'

const EditorWrap = styled.div`
.ql-toolbar.ql-snow {
  padding: 2px 8px;
}
.ql-snow .ql-editor {
  min-height: 300px;
  max-height: 600px;
  img {
    height: auto;
  }
  p {
    margin: 10px 0;
  }
  pre.ql-syntax {
    background-color: #f6f8fa;
    color: #24292e;
  }
  code {
    background-color: rgba(27,31,35,0.05);
    color: #24292e;
  }
}
.ql-snow .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  vertical-align: top;
}
`

class Editor extends React.Component {
    reactQuillRef = null
    quillRef = null

    modules = {
        toolbar: {
            container: [
                [{'header': []}],
                ['code', 'bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                [{'color': []}, {'background': []}],
                [{'align': []}],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                ['clean']
            ]
        }
    }


    componentDidMount() {
        if (this.reactQuillRef) this.attachQuillRefs()
    }

    imageHandler(args) {
        let fileInput = this.container.querySelector('input.ql-image[type=file]')
        if (fileInput == null) {
            fileInput = document.createElement('input')
            fileInput.setAttribute('type', 'file')
            fileInput.setAttribute('name', 'file')
            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
            fileInput.classList.add('ql-image')
            console.log(fileInput)
            fileInput.addEventListener('change', () => {
                if (fileInput.files != null && fileInput.files[0] != null) {
                    console.log(fileInput.files[0])
                    // uploadImage(fileInput.files[0])
                    //     .then(res => {
                    //         let range = this.quill.getSelection(true)
                    //         this.quill.updateContents(new Delta()
                    //                 .retain(range.index)
                    //                 .delete(range.length)
                    //                 .insert({ image: res })
                    //             , Quill.sources.USER)
                    //         fileInput.value = ''
                    //     })
                }
            })
            this.container.appendChild(fileInput)
        }
        fileInput.click()
    }


    attachQuillRefs = () => {
        if (typeof this.reactQuillRef.getEditor !== 'function') return
        this.quillRef = this.reactQuillRef.getEditor()
        console.log(this.quillRef)
        this.quillRef.clipboard.addMatcher('IMG', function (node, delta) {
            console.log(data)
            let data = delta.ops[0]
            let src = ''
            if (data) {
                src = data.insert.image
            } else if (node.dataset.src) {
                src = node.dataset.src
                delta.ops.push({insert: {image: src}})
            }
            // if (src && isOtherSiteImg(src)) {
            //     actions.article.onImgPasted(src)
            // }
            return delta
        })
        if (this.props.action === 'create') {
            this.reactQuillRef && this.reactQuillRef.setEditorContents(this.quillRef, '')
        } else {
            console.log(this.props.req)

            this.props.req && this.props.req.then(content => {
                if (this.reactQuillRef) {
                    this.reactQuillRef && this.reactQuillRef.setEditorContents(this.quillRef, content)
                }
            })
        }
        const toolbar = this.quillRef.getModule('toolbar')
        toolbar.addHandler('image', this.imageHandler)
    }

    editorChange = () => {
        if (!this.quillRef) return
        const content = this.quillRef.getContents()
        this.props.onChange(content)
    }

    render() {
        return (

            <EditorWrap>
                <ReactQuill ref={el => this.reactQuillRef = el}
                            onChange={this.editorChange}
                            modules={this.modules}
                >

                </ReactQuill>
            </EditorWrap>
        )
    }
}

export default Editor