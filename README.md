# Birthday Gacha for Xenia

An Angular birthday flow with six art-themed choices, two trivia paths, four mini-games, and a three-pull gacha. The first pull always misses. The next two use the chance earned from that path.

## Run it in VS Code

1. Install Node.js 22.12 or newer.
2. Open this folder in VS Code.
3. In the integrated terminal, run `npm install` the first time, then `npm start`.
4. Visit `http://localhost:4200`.

## Add your six art files and artist credits

In `src/app/birthday-content.ts`, fill in each art reward's `image`, `artistQuote`, and `artistCredit`. Put your files in `public/images/Arts/` and use paths like `/images/Arts/sylus.png`. Indigo & white has two art reward entries; a successful gacha randomly reveals one of those two. The other themes each have one. The six art theme entries are:

- Sylus — wine red and black (trivia)
- White and blue (trivia)
- Indigo and white (whack-a-mole)
- Purple and black (ball bounce)
- Wine red and purple (fast typing)
- Orange and white (aim trainer)

The two quiz lists are in those first two entries. Add or edit three question objects there. `correct` uses answer numbers: `1` is the first answer, `2` the second, and `3` the third. A correct answer adds 23 percentage points; the chance is capped at 70%.

### Add pictures beside a trivia question

1. Put the image files in `public/images/Questions/` (you can make subfolders such as `Sylus` and `WhiteBlue` to keep them organized).
2. Open the matching trivia path in `src/app/birthday-content.ts` and add `leftImage` and/or `rightImage` to that question. These fields control which side of the question the image appears on.
3. Use a path relative to the `public` folder, starting with `images/`. For example:

```ts
{
  prompt: 'Which one is Sylus?',
  answers: ['Option A', 'Option B', 'Option C'],
  correct: 1,
  note: 'Nice one!',
  leftImage: 'images/Questions/Sylus/q1-left.png',
  rightImage: 'images/Questions/Sylus/q1-right.jpg',
},
```

You can add just one side or both. If you leave a side out, the page shows its “LEFT IMAGE” or “RIGHT IMAGE” placeholder. Match the filename and capitalization exactly; PNG, JPG, GIF, and WebP files work in the browser.

## Add game sounds and gacha videos

Each path has its own `media` object in `src/app/birthday-content.ts`, with separate `pullVideo` and `loseVideo` paths. The six distinct pull/loss video pairs are prefilled with filenames under `/media/gacha/`; add your matching video files with those names, or edit that path's fields. `pullVideo` plays on every pull and `loseVideo` plays after each miss. Add the optional `gachaAudio`, `winAudio`, `loseAudio`, and `gameAudio` paths there too. The whack-a-mole path also has a `moleImage` path.

Odds follow the game scores: each correct trivia answer adds 23 points; wrong answers reveal the right answer and continue without a retry. Fast typing starts at 70% and loses 10 points on each failed attempt, down to 40%; the clock begins on the first keystroke and extends to 10 seconds after three failed attempts. Bounce time maps to 70% at the fastest and 40% at ten seconds. Aim hits and mole hits each add 10 percentage points, capped at 70%. The first gacha pull is a guaranteed miss. Each later ordinary pull compares a random roll from 1 to 100 with the earned chance; the roll and chance are shown after resolution. Every pull plays its path's pull video, with a skip button; a miss then plays its separate lose video, also skippable. Losing all pulls returns to the art choices; selecting a path again resets its game and odds. After a path's pulls are fully lost (or the player leaves after a miss), that path's next visit guarantees a win on pull two, after its required first miss. The small **Reset retry guarantee** button at the top right of the choices clears these saved guarantees for testing; they are stored in the current browser's local storage.

## Add looping background music

Place an audio file at `public/media/music/background-loop.mp3` (create the `music` folder if needed). The site starts playback after the first click or key press because browsers block autoplay before user interaction. The top bar has a mute toggle and volume slider.

## Publish on GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages** and set the build source to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` deploys after each push to `main`.
