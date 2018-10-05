(() => {
  'use strict'

  // Important regexes
  const regex = {
    name: /patrick([ -]|&[a-z]{1,5};)hernandez/ig,
    nameFirst: /\bpatrick\b/ig,
    nameLast: /\bhernandez\b/ig,
    song: /born (to be|2b) alive/ig
  }

  /**
   * Replaces the wrong author with the right one
   *
   * @param {Array} nodes List of nodes to update
   */
  const replaceHernandez = nodes => {
    nodes.forEach(node => {
      // Replace text content
      if (node.nodeType == Node.TEXT_NODE && node.textContent.match(regex.song)) { // eslint-disable-line eqeqeq
        node.textContent = node.textContent.replace(regex.name, 'Village People')
        return
      }

      // Replace anchor content
      if (node.nodeType == Node.ELEMENT_NODE && node.innerText.match(regex.song)) { // eslint-disable-line eqeqeq
        node.innerHTML = node.innerHTML
          .replace(regex.name, 'Village People')
          .replace(regex.nameFirst, 'Village')
          .replace(regex.nameLast, 'People')
      }
    })
  }

  /**
   * Replace the title, if required
   */
  const replaceTitle = () => {
    if (document.title.match(regex.song)) {
      document.title = document.title.replace(regex.name, 'Village People')
    }
  }

  /**
   * Replace all nodes
   */
  const findAndReplaceNodes = () => {
    let nodes = []

    // Insert all text nodes
    document.querySelectorAll('*').forEach(node => {
      node.childNodes.forEach(node => node.nodeType == Node.TEXT_NODE && nodes.push(node)) // eslint-disable-line eqeqeq
    })

    // Insert all anchor nodes
    document.querySelectorAll(`a`).forEach(node => nodes.push(node))

    // Replace nodes
    replaceHernandez(nodes)
  }

  let isLocked = false

  /**
   * Actually handle, releasing the lock
   */
  const _doHandle = () => {
    isLocked = false
    findAndReplaceNodes()
    replaceTitle()
  }

  /**
   * Handle page updates, using an animation frame and locking to prevent overhead
   */
  const handle = () => {
    if (!isLocked) {
      isLocked = true
      requestAnimationFrame(_doHandle)
    }
  }

  // Handle right now
  handle()

  // Also handle on changes
  document.addEventListener('load', handle(), {passive: true})

  // Special cases for YouTube
  if (document.location.hostname.match(/youtube.com$/i)) {
    // Find the YouTube app (the only visible node in <body>)
    const youTubeApps = Array.prototype.filter.call(document.querySelectorAll('body > *'), node => node.offsetParent !== null)

    youTubeApps.forEach(node => {
      node.addEventListener('yt-navigate', handle, { passive: true })
      node.addEventListener('yt-page-type-changed', handle, { passive: true })
      node.addEventListener('yt-update-title', handle, {passive: true})
    })
  }
})()
