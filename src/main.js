import './main.scss'

global.WireLang = {

  optionClass: {
    '/': 'wl-hidden',
    ':': 'wl-horizontal',
    '-': 'wl-no-frame',
    '+': 'wl-special-1',
    '*': 'wl-special-2',
    '$': 'wl-underline',
    '^': 'wl-upper',
    '@': 'wl-alias'
  },

  run (text, container, specLabel) {
    this.render(this.parse(text, specLabel), container)
  },

  parse (text, specLabel) {
    text = text.trim().replace(/^\s*$/gm, '')
    let lines = text.split(/(?:\r?\n)+/)

    let items = []
    let specLevel = - 1
    for (let line of lines) {
      let level = (line.match(/^(\s*)/) || [])[1].length
      let option = (line.match(/^\s*([:\/\-\+\*\$@\^~]+)/) || [ '', '' ])[1]
      let label = line.replace(/^\s*/, '').replace(/^[:\/\-\+\*\$@\^~]+/, '')
      let description = (label.match(/:([^:]+)$/) || [ '', '' ])[1]
      label = label.replace(/:[^:]+$/, '')

      if (specLabel !== '') {
        if (specLevel !== - 1 && level <= specLevel) {
          specLevel = - 1
          break
        }
        if (label === specLabel) {
          specLevel = level
        }
        if (specLevel === - 1) {
          option = '/'
        }
      }

      items.push({ level, option, label, description, contents: [] })
    }

    let baseLevelLength = 0
    for (let item of items) {
      if (item.level > 0) {
        baseLevelLength = item.level
        break
      }
    }
    for (let item of items) {
      if (item.level > 0) {
        item.level /= baseLevelLength
      }
    }

    let results = []
    let current = results
    let parents = {}
    for (let i = 0; i < items.length; i ++) {
      if (i > 0) {
        if (items[i - 1].level < items[i].level) {
          current = items[i - 1].contents
        } else if (items[i - 1].level > items[i].level) {
          current = results
          for (let j = items[i].level - 1; j >= 0; j --) {
            if (parents[j] !== undefined) {
              current = parents[j].contents
              break;
            }
          }
        }
        if (items[i].option.indexOf('@') !== - 1) {
          items[i] = JSON.parse(JSON.stringify(parents[items[i].level]))
          items[i].option += '@'
        }
      }
      parents[items[i].level] = items[i]
      current.push(items[i])
    }
    return results
  },

  render (items, parentNode) {
    for (let item of items) {

      let node = document.createElement('div')
      parentNode.appendChild(node)
      node.classList.add('wl-node')
      node.classList.add(`wl-level-${item.level}`)
      if (item.option != null) {
        for (let option in this.optionClass) {
          if (item.option.indexOf(option) !== - 1) {
            node.classList.add(this.optionClass[option])
          }
        }
      }

      if (item.label !== '') {
        let labelNode = document.createElement('div')
        node.appendChild(labelNode)
        labelNode.classList.add('wl-label')
        labelNode.innerText = item.label

        if (item.description !== '') {
          let descriptionNode = document.createElement('div')
          labelNode.appendChild(descriptionNode)
          descriptionNode.classList.add('wl-description')
          descriptionNode.innerText = item.description
        }

      }

      if (item.contents.length > 0) {

        let contentsNode = document.createElement('div')
        node.appendChild(contentsNode)
        contentsNode.classList.add('wl-contents')

        this.render(item.contents, contentsNode)

      }

    }
  }

}
