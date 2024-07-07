document.addEventListener('DOMContentLoaded', function() {
  let addBtn = document.getElementById('addBtn');
  let newWordInput = document.getElementById('newWord');
  let blockedWordsList = document.getElementById('blockedWordsList');
  let caseSensitiveCheckbox = document.getElementById('caseSensitiveCheckbox');

  // Load saved blocked words from storage
  chrome.storage.sync.get(['blockedWords'], function(result) {
    let blockedWords = result.blockedWords || [];
    updateBlockedWordsList(blockedWords);
  });

  addBtn.addEventListener('click', function() {
    let newWord = newWordInput.value.trim();
    if (newWord !== '') {
      chrome.storage.sync.get(['blockedWords'], function(result) {
        let blockedWords = result.blockedWords || [];
        if (!isWordBlocked(blockedWords, newWord)) {
          blockedWords.push(newWord);
          chrome.storage.sync.set({ blockedWords: blockedWords }, function() {
            updateBlockedWordsList(blockedWords);
            newWordInput.value = '';
          });
        } else {
          alert('Word is already blocked!');
        }
      });
    }
  });

  // Function to check if a word is already blocked
  function isWordBlocked(blockedWords, word) {
    return blockedWords.some(blockedWord => {
      if (caseSensitiveCheckbox.checked) {
        return blockedWord === word;
      } else {
        return blockedWord.toLowerCase() === word.toLowerCase();
      }
    });
  }

  // Function to remove a blocked word
  function removeBlockedWord(wordToRemove) {
    chrome.storage.sync.get(['blockedWords'], function(result) {
      let blockedWords = result.blockedWords || [];
      let index = blockedWords.indexOf(wordToRemove);
      if (index !== -1) {
        blockedWords.splice(index, 1);
        chrome.storage.sync.set({ blockedWords: blockedWords }, function() {
          updateBlockedWordsList(blockedWords);
        });
      }
    });
  }

  // Update blocked words list in UI
  function updateBlockedWordsList(blockedWords) {
    blockedWordsList.innerHTML = '';
    blockedWords.forEach(word => {
      let li = document.createElement('li');
      li.textContent = word;

      // Create a delete button for each blocked word
      let deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('deleteBtn');
      deleteBtn.addEventListener('click', function() {
        removeBlockedWord(word);
      });

      // Append delete button to the list item
      li.appendChild(deleteBtn);
      blockedWordsList.appendChild(li);
    });
  }
});
