import Delta from 'quill-delta'
import _escape from 'lodash/escape'

const blockKeys = [
  'code-block', 'header', 'blockquote', 'align', 'list', 'direction', 'indent'
]

const blockValues = {
  'code-block': {
    isTag: true,
    value: {
      tag: 'pre',
      className: 'syntax',
      attributes: {
        spellcheck: 'false'
      }
    }
  },
  blockquote: {
    isTag: true,
    value: {
      tag: 'blockquote'
    }
  },
  header: {
    isTag: true,
    value: {
      tag: (val) => {
        let level = val | 0
        if (val > 6) level = 6
        if (val < 1) return false
        return `h${level}`
      }
    }
  },
  align: {
    value: {
      className: (val) => {
        if (['center', 'right', 'justufy'].indexOf(val) === -1) return false
        return `align-${val}`
      }
    }
  },
  indent: {
    value: {
      className: (val) => {
        let level = val | 0
        if (level > 8) level = 8
        if (level < 1) return false
        return `indent-${level}`
      }
    }
  },
  direction: {
    value: {
      className: (val) => {
        if (val === 'rtl') return 'direction-rtl'
        return false
      }
    }
  },
  list: {
    isTag: true,
    parent: (val) => {
      if (val === 'ordered') return 'ol'
      if (val === 'bullet') return 'ul'
      return false
    },
    value: {
      tag: (val) => {
        if (val === 'ordered' || val === 'bullet') return 'li'
        return false
      }
    }
  }
}

const inlineKeys = [
  'color', 'background', 'bold', 'italic', 'underline', 'strike',
  'size', 'code', 'link', 'script', 'font'
]

const inlineValues = {
  color: {
    value: {
      style: (val) => `color:${val}`
    }
  },
  background: {
    value: {
      style: (val) => `background-color:${val}`
    }
  },
  bold: {
    isTag: true,
    tagLevel: 100,
    value: {
      tag: 'strong'
    }
  },
  italic: {
    isTag: true,
    tagLevel: 200,
    value: {
      tag: 'em'
    }
  },
  strike: {
    isTag: true,
    tagLevel: 300,
    value: {
      tag: 's'
    }
  },
  underline: {
    isTag: true,
    tagLevel: 400,
    value: {
      tag: 'u'
    }
  },
  script: {
    isTag: true,
    tagLevel: 50,
    value: {
      tag: (val) => {
        if (val === 'sub') return 'sub'
        if (val === 'super') return 'sup'
      }
    }
  },
  code: {
    isTag: true,
    tagLevel: 40,
    value: {
      tag: 'code'
    }
  },
  size: {
    value: {
      className: (val) => {
        if (['small', 'large', 'huge'].indexOf(val) !== -1) {
          return `size-${val}`
        }
        return false
      }
    }
  },
  font: {
    value: {
      className: (val) => `font-${val}`
    }
  },
  link: {
    isTag: true,
    tagLevel: 45,
    value: {
      tag: 'a',
      link: (val) => val
    }
  }
}

// const embedKeys = ['image']
const embedValues = {
  image: (val) => {
    return `<img src="${val}">`
  }
}

const getValue = (attr, val) => {
  if (typeof attr === 'string') return attr
  else if (typeof attr === 'function') return _escape(attr(val))
  return false
}

const clsPrefix = 'ql'
const delta2html = (data) => {
  const delta = new Delta(data)
  let html = ''
  let blockArr = []
  delta.eachLine((line, attrs) => {

    // block
    let blockTag = 'p'
    let blockClass = []
    let blockAttr = []
    let blockParent = null
    for (let [key, value] of Object.entries(attrs)) {
      if (value && blockKeys.indexOf(key) !== -1) {
        const config = blockValues[key]
        if (config.isTag) {
          const tag = getValue(config.value.tag, value)
          if (tag) blockTag = tag
        }
        if (config.value.className) {
          const cls = getValue(config.value.className, value)
          if (cls) blockClass.push(`${clsPrefix}-${cls}`)
        }
        if (config.value.attributes) {
          blockAttr = blockAttr.concat(Object.entries(config.value.attributes))
        }
        if (config.parent) {
          blockParent = getValue(config.parent, value)
        }
      }
    }

    // inline
    let inlineHtml = ''
    line.ops.forEach(item => {
      let inlineTag = []
      let inlineClass = []
      let inlineStyle = []
      let inlineAttr = []
      let inlineLink = ''
      let htmlTemp = ''
      if (typeof item.insert === 'string') {
        htmlTemp = _escape(item.insert)
        if (item.attributes) {
          for (let [key, value] of Object.entries(item.attributes)) {
            if (value && inlineKeys.indexOf(key) !== -1) {
              const config = inlineValues[key]
              if (config.isTag) {
                const tag = getValue(config.value.tag, value)
                if (tag) inlineTag.push({ tag, order: config.tagLevel })
              }
              if (config.value.className) {
                const cls = getValue(config.value.className, value)
                if (cls) inlineClass.push(`${clsPrefix}-${cls}`)
              }
              if (config.value.style) {
                const style = getValue(config.value.style, value)
                if (style) inlineStyle.push(style)
              }
              if (config.value.link) {
                const link = getValue(config.value.link, value)
                if (link) inlineLink = link
              }
              if (config.value.attributes) {
                const ilArr = Object.entries(config.value.attributes).map(attr => {
                  let val = attr[1]
                  if (typeof attr[1] === 'boolean') val = value
                  return [attr[0], val]
                })
                inlineAttr = inlineAttr.concat(ilArr)
              }
            }
          }
        }
      } else if (typeof item.insert === 'object') {

        // embed
        if (item.insert.image) {
          htmlTemp = embedValues.image(_escape(item.insert.image))
        }
      }

      // inline html
      const sortedTag = inlineTag.sort((a, b) => b.order - a.order)
      if (!sortedTag.length && (inlineClass.length || inlineStyle.length || inlineAttr.length)) {
        sortedTag.push({ tag: 'span' })
      }
      sortedTag.forEach((tag, i) => {
        let linkStr = ''
        if (tag.tag === 'a' && inlineLink) {
          linkStr = ` href="${inlineLink}" target="_blank"`
        }
        if (i === (sortedTag.length - 1)) {
          const classNameStr = inlineClass.length
            ? ` class="${inlineClass.join(' ')}"`
            : ''
          const styleStr = inlineStyle.length
            ? ` style="${inlineStyle.join(';')}"`
            : ''
          const attrStr = inlineAttr.length
            ? ' ' + inlineAttr.map(attr => `${attr[0]}="${attr[1]}"`).join(' ')
            : ''

          htmlTemp = `<${tag.tag}${classNameStr}${styleStr}${attrStr}${linkStr}>${htmlTemp}</${tag.tag}>`
        } else {
          htmlTemp = `<${tag.tag}${linkStr}>${htmlTemp}</${tag.tag}>`
        }
      })

      inlineHtml += htmlTemp
    })

    blockArr.push({
      blockClass, blockAttr, blockTag, inlineHtml, blockParent
    })
  })

  let lastTag = ''
  let lastParent = null
  blockArr.forEach((item, index) => {
    const blockClassNameStr = item.blockClass.length
      ? ` class="${item.blockClass.join(' ')}"`
      : ''
    const blockAttrStr = item.blockAttr.length
      ? ' ' + item.blockAttr.map(attr => `${attr[0]}="${attr[1]}"`).join(' ')
      : ''
    if (item.blockTag === 'pre') {
      if (lastParent) {
        html += `</${lastParent}>`
      }

      if (lastTag !== item.blockTag) {
        if (lastTag) html += `</${lastTag}>`
        html += `<${item.blockTag}${blockClassNameStr}${blockAttrStr}>${item.inlineHtml}\n`
      } else {
        html += `${item.inlineHtml}\n`
      }
      lastTag = item.blockTag
      lastParent = item.blockParent
      if (index === (blockArr.length - 1)) {
        html += `</${lastTag}>`
      }
      return
    } else {
      if (lastTag === 'pre') {
        html += `</${lastTag}>`
      }
    }

    if (item.blockParent) {
      if (lastParent !== item.blockParent) {
        if (lastParent) html += `</${lastParent}>`
        html += `<${item.blockParent}>`
      }
    } else {
      if (lastParent) {
        html += `</${lastParent}>`
      }
    }

    html += `<${item.blockTag}${blockClassNameStr}${blockAttrStr}>${item.inlineHtml.trim() || '<br>'}</${item.blockTag}>`

    lastTag = item.blockTag
    lastParent = item.blockParent
    if (index === (blockArr.length - 1) && lastParent) {
      html += `</${lastParent}>`
    }
  })

  return html
}

export default delta2html