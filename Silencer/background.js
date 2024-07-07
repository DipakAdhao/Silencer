// background.js

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'replaceWords') {
    replaceWords(message.wordsToReplace);
  }
});

function replaceWords(wordsToReplace) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function(wordsToReplace) {
        const elements = document.querySelectorAll('*');

        elements.forEach(element => {
          wordsToReplace.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match whole words only
            element.innerHTML = element.innerHTML.replace(regex, '***'); // Replace matched words with ***
          });
        });
      },
      args: [wordsToReplace]
    });
  });
}
