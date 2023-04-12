"use strict"

// Tweak to make a double-click select words with hyphens or
// apostrophes.
// 
// As of 2023-04-11, None of the major Mac browsers selects whole
// words with hyphens, like "ad-lib". This tweak fixes the hypen
// issue.
// 
// Note: Firefox (at least until version 111.0.1) doesn't
// automatically select whole words with apostrophes like the word
// "doesn't". This tweak also treats that issue.

// In the comments below, I'll use the word "join" to mean any of
// the following hyphen and apostrophe characters:
//
//  * - (hyphen: &#8208;)
//  * ‑ (non‑breaking hypen: &8209;)
//  * &shy; (soft hyphen, which only appears at a line break)
//  * ' (apostrophe: &#39;)
//  * ’ (right single quotation mark: &#8217;).
//
// NOTE 1: It is not trivial to distinguish between a final 
// apostrophe, which is an integral part of a word, that is used
// to indicate possession)...
//
//   She said, "Those books are Jodi's, but these are my kids'".
//
// ... from a closing single quote:
//
//   He said, "She said, 'Meet Jo and Di. These are my kids'".
//
// For simplicity, this script ignores both cases. As of 2023-04-12,
// this is the same functionality as is found in all major browsers. 
//
// NOTE 2: Two hyphens can be used to indicate a dash—a character
// which indicates a secondary thought–and some writers leave no
// spaces around a dash. However it is never used to make compound
// words. "Two consecutive hypens should be ignored--at least I
// think they should."

  


;(function selectWholeWordsWithHyphens(){
  var selection = window.getSelection()
  // Regex designed to detect if the selection is just a series of
  // join characters.
  var ignoreRegex = /^[\u00AD‑'’-]{2,}$/

  // Regex designed to find a word+join before the selected word.
  // Examples: ad-|lib|  seven-o'|clock|
  // It finds the last chunk with no non-word characters (except for
  // joins) before the first selected character. 
  var startRegex = /(\w+[\u00AD‑'’-]?)+$/g

  // Regex designed to find a join character after the selected word.
  // Examples: |ad|-lib  |seven|-o'clock
  var endRegex = /^([\u00AD‑'’-]?\w+)+/

  // Edge case: check if the selection contains no word characters
  // or - or '. If so, then don't do anything to extend it.
  var edgeRegex = /\w|-|‑|'|’|\u00AD/

  document.body.ondblclick = selectHyphenatedWords

  function selectHyphenatedWords(event) {
    if (dontUseSelectHyphenatedWords) {
      return
    }

    var target = event.target
    var isInput = target.tagName === "INPUT"

    if (isInput) {
      var start = target.selectionStart
      var end = target.selectionEnd
      var string = target.value
      
    } else if (!selection.rangeCount) {
      return

    } else {
      var range = selection.getRangeAt(0)
      // If the selection is at the boundary of a tag – for example:
      // <p>The selection word is one of <em>these-words</em></p> —
      // then range.startContainer and range.endContainer will be
      // different.
      var container = range.endContainer
      var end = range.endOffset
      if (!end) {
        // The selection extends to the end of the startContainer
        // and ends at char index 0 in the endContainer. Use the
        // startContainer instead
        container = range.startContainer
        end = container.length
      }
      var string = container.textContent
      var start = (container === range.startContainer)
        ? range.startOffset
        : 0 // The selection starts at the very end of the 
            // startContainer, or at char index 0 of the
            // endContainer
    }
    
    var selectionUpdated = false
    var chunk = string.substring(start, end)
    var ignore = ignoreRegex.test(chunk)
              || chunk.search(edgeRegex) < 0    

    if (ignore) {
      // The selection contains neither word nor join characters
      // or is nothing but a series of join characters
      return
    }

    extendSelectionBackBeforeHypen(string, start)
    extendSelectionForwardAfterHyphen(string, end)

    if (selectionUpdated) {
      if (isInput) {
        target.setSelectionRange(start, end)
      } else {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    function extendSelectionBackBeforeHypen(string, offset) {
      var lastIndex = 0
      var result
        , index
      string = string.substring(0, offset)
      
      while (result = startRegex.exec(string)) {        
        index = result.index
        lastIndex = startRegex.lastIndex
      }

      if (lastIndex === offset) {
        if (isInput) {
          start = index
        } else {
          range.setStart(container, index)
        }
        selectionUpdated = true
      }
    }

    function extendSelectionForwardAfterHyphen(string, offset) { 
      if (!offset) {
        return
      }

      string = string.substring(offset)
      var result = endRegex.exec(string)      

      if (result) {
        end = offset + result[0].length
        if (!isInput) {
          range.setEnd(container, end)
        }
        selectionUpdated = true
      }
    }
  }
})()