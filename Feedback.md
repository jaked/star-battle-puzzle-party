Feedback

* Everyone loved the glitch app. I'll definitely be using it for hosting future star battle sessions.
* There was a lot of praise for how well you made this, especially the interface polish and the color selection
* No bugs were encountered AFAIK
* Latency: it was difficult to collaborate on the same regions, because we'd end up clicking on the same cells at almost exactly the same time, which would instantly undo the action.
  * This happened very often.
  * Whenever it happened, we would attempt the same thing again (reflexively), and the same issue would occur. I've seen it occur like 3 times in a row for one of the cells :laughing:
  * We alleviated this by assigning a single person to "drive" but it felt like unnecessary friction
  * Someone proposed a solution: if two identical actions come in within the same XXmillisecond time window, discard one of the actions. I'm not sure if that's easy to test/implement.
* Reset button: There were a few disaster misclicks on this button, causing our progress to be wiped :sweat_smile:
  * Got reports that the meaning of "Reset" was ambiguous. Users were too afraid to click to find out.
  * Some assumed it resets the snapshots only, or resets the latest snapshot only
  * Some suggestions I got: display a pop up window when reset is clicked, explaining what will happen when the user clicks okay / rename the button to something more clear and ominous (like "wipe everything")
* Undo was requested for regular moves + to undo resets
* Snapshots: highlighting the latest snapshot or placing a border around it would be nice, or providing some way of deducing the snapshot order without having to squint at the content
* Displaying how many stars the current puzzle has: (1, 2, or 3)
  * This is already done in the puzzle selector dropdown (via puzzle names) but puzzle names get truncated on some browsers (like firefox/safari I think) and the full name is only displayed when the dropdown menu is active.
* laser pointer: only got a couple of requests for this, but we compensated by using coordinates and flashing highlight colors (it works really well for this purpose)
* I got requests for confetti/a congratulatory message when a puzzle is solved while puzzle checking is activated