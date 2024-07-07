chrome.storage.sync.get(['blockedWords'], function(result) {
  let blockedWords = result.blockedWords || [];
  censorText(document.body, blockedWords);
});

function censorText(element, blockedWords) {
  function traverse(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      let text = element.nodeValue;
      blockedWords.forEach(badWord => {
        let regex = new RegExp('\\b' + badWord + '\\b', 'gi'); // Match whole words only
        text = text.replace(regex, "****");
      });
      element.nodeValue = text;
    } else if (element.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < element.childNodes.length; i++) {
        traverse(element.childNodes[i]);
      }
    }
  }

  traverse(element);
}
