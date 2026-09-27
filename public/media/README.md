Add your game and gacha media here, then set its path in the matching art entry in `src/app/birthday-content.ts` under `media`.

- `pullVideo`: this art's gacha video, played for every pull.
- `loseVideo`: this art's loss video, played after a miss.
- `gachaAudio`: sound played when a pull starts.
- `winAudio` and `loseAudio`: result sounds.
- `gameAudio`: this path's mini-game sound effect.
- `moleImage`: target image for Indigo & white's whack-a-mole game (the game sound is `gameAudio`).

The six unique video pairs are configured in `src/app/birthday-content.ts`:

- `sylus-pull.mp4` / `sylus-loss.mp4`
- `white-blue-pull.mp4` / `white-blue-loss.mp4`
- `indigo-pull.mp4` / `indigo-loss.mp4`
- `purple-black-pull.mp4` / `purple-black-loss.mp4`
- `wine-purple-pull.mp4` / `wine-purple-loss.mp4`
- `orange-white-pull.mp4` / `orange-white-loss.mp4`

Add those files under the `gacha/` folder here (or change the corresponding `pullVideo` and `loseVideo` values). Example full path: `/media/gacha/sylus-pull.mp4`.
