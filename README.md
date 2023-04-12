# Select Hyphenated Words #

As of 2023-04-11, in all the major browsers, a double-click on a word that contains a hyphen (like **double-click**) will select only the part of the word that was clicked on, or just the hyphen. This is because browsers base their behaviour on the underlying system (MacOS, Windows or *nix), and the underlying system considers that hyphens indicate a word break.

In addition, in Firefox only (at least until version 111.0.1), a double-click on a word that contains an apostrophe (like **it's 3 o'clock on Lee's clock**), will also fail to select the whole word.

In Safari (at least until version 16.3), a double-click that lands precisely on an apostrophe will select only the apostrophe. However, a double-click on any *letter* in a word that contains an apostrophe will select the entire word, including the apostrophe.

There are several glyphs that can be used to show hyphens and apostrophes:

* \- (hyphen: `&#8208;`)
* ‑ (non‑breaking hypen: `&8209;`)
* `&shy;` (soft hyphen, which only appears at a line break)
* ' (apostrophe: `&#39;`)
* ’ (right single quotation mark: `&#8217;`).

This is a demo of a function that will treat all of these as an integral part of a word, so that the whole word is selected when it is double-clicked. You can toggle the function off and on by clicking on a checkbox.
