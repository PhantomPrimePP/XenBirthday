import { ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { ArtReward, BIRTHDAY_PATHS, ColorKey, ColorPath, TriviaQuestion } from './birthday-content';

type Page = 'welcome' | 'tease' | 'hub' | 'trivia' | 'game' | 'gacha' | 'reward';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="site-shell" [style.--accent]="selectedPath?.color || '#D1A751'">
      <header class="topbar">
        <a class="wordmark" href="#" (click)="go('welcome', $event)"></a>
        <span class="top-note">I MADE SOMETHING AGAIN! HEHE</span>
        <div class="music-controls" aria-label="Background music controls">
          <button type="button" class="music-toggle" (click)="toggleMusic()" [attr.aria-label]="musicMuted ? 'Unmute background music' : 'Mute background music'">{{musicMuted ? '♫ OFF' : '♫ ON'}}</button>
          <label class="volume-control"><span>VOL</span><input type="range" min="0" max="1" step="0.01" [value]="musicVolume" (input)="setMusicVolume($event)" aria-label="Background music volume"></label>
        </div>
      </header>

      <section class="stage welcome-stage" [class.stage-hidden]="page !== 'welcome'" aria-label="Birthday welcome">
        <div class="photo-rail photo-rail-left">
          @for (photo of welcomePhotos.slice(0, 2); track photo.label) { <div class="memory-frame" [class.memory-empty]="!photo.src">
            @if (photo.src) { <img [src]="photo.src" [alt]="photo.alt"> } @else { <span class="image-plus">＋</span><span class="image-label">{{photo.label}}<br>ADD YOUR PHOTO</span> }
            @if (photo.src) { <span class="image-label">{{photo.label}}</span> }
          </div> }
        </div>
        <div class="welcome-copy">
          <p class="eyebrow"><span class="eyebrow-line"></span> You were born today baws! <span class="sparkle">✦</span></p>
          <h1>Happy<br>birthday<br><em>EMOJINGX.</em></h1>
          <p class="intro">I had to look up so much lads for this 💔</p>
          <button class="pill-button primary-button" (click)="go('tease')">Go NEXT <span>↗</span></button>
          <p class="tiny-caption">A VERY AI GENERATED PAGE! &nbsp;·&nbsp; Because I was Lazy</p>
        </div>
        <div class="photo-rail photo-rail-right">
          @for (photo of welcomePhotos.slice(2, 4); track photo.label) { <div class="memory-frame" [class.memory-empty]="!photo.src">
            @if (photo.src) { <img [src]="photo.src" [alt]="photo.alt"> } @else { <span class="image-plus">＋</span><span class="image-label">{{photo.label}}<br>ADD YOUR PHOTO</span> }
            @if (photo.src) { <span class="image-label">{{photo.label}}</span> }
          </div> }
        </div>
        <div class="page-index"><span>01</span><i></i> 04</div>
      </section>

      <section class="stage tease-stage" [class.stage-hidden]="page !== 'tease'" aria-label="A birthday tease">
        <div class="tease-photo-side">
          <div class="bubble bubble-left">{{teasePhotos[0].comment}}</div>
          <div class="memory-frame tease-frame" [class.memory-empty]="!teasePhotos[0].src">
            @if (teasePhotos[0].src) { <img [src]="teasePhotos[0].src" [alt]="teasePhotos[0].alt"> } @else { <span class="image-plus">＋</span><span class="image-label">TEASING PIC 01<br>ADD YOUR PHOTO</span> }
          </div>
        </div>
        <div class="tease-copy"><p class="eyebrow"><span class="eyebrow-line"></span> From Employee of the Month</p><h2>You Deserve This<br><em>Because you are amazing person</em></h2><p>I met you almost a year ago and you are funny and good boss. So I make your birthday good </p><p class="aside-note">Be Prepared! </p><button class="pill-button primary-button" (click)="go('hub')">Go Next! <span>↗</span></button></div>
        <div class="tease-photo-side tease-photo-right">
          <div class="bubble bubble-right">{{teasePhotos[1].comment}}</div>
          <div class="memory-frame tease-frame" [class.memory-empty]="!teasePhotos[1].src">
            @if (teasePhotos[1].src) { <img [src]="teasePhotos[1].src" [alt]="teasePhotos[1].alt"> } @else { <span class="image-plus">＋</span><span class="image-label">TEASING PIC 02<br>ADD YOUR PHOTO</span> }
          </div>
        </div>
        <div class="page-index"><span>02</span><i></i> 04</div>
      </section>

      <section class="hub-stage" [class.stage-hidden]="page !== 'hub'" aria-label="Choose your colour path">
        <button class="pity-reset" (click)="resetPity()" title="Clear saved retry guarantees">Reset retry guarantee</button>
        <div class="hub-heading"><p class="eyebrow"><span class="eyebrow-line"></span> WOnder what this means</p><h2>Pick a colour.<br><em>And Have fun</em></h2><p>Pick any color you like first and see what happens 😁</p></div>
        <div class="color-grid">
          @for (entry of colorEntries; track entry.key; let i = $index) {
            <button class="color-card" [style.--swatch]="entry.path.color" [style.--swatch-text]="entry.path.swatchText" (click)="chooseColor(entry.key)">
              <span class="swatch-wrap" [style.--secondary]="entry.path.secondaryColor">
                <span class="swatch-gift">✦</span>
                <span class="card-arrow">↗</span>
              </span>
              <span class="card-index">0{{i + 1}} &nbsp; / &nbsp; LITTLE QUEST</span><strong>{{entry.path.name}}</strong><span class="card-subtitle">{{entry.path.theme}}</span>
            </button>
          }
        </div>
        <p class="hub-footnote">PICK WHATEVER FEELS LIKE YOU RIGHT NOW <span>✦</span></p>
        <div class="page-index"><span>03</span><i></i> 04</div>
      </section>

      <section class="quiz-stage" [class.stage-hidden]="page !== 'trivia'" aria-label="Trivia questions">
        @if (selectedPath; as path) {
          @if (currentQuestion; as question) {
            <div class="quiz-heading"><button class="text-back" (click)="go('hub')">← ALL SIX ARTS</button><p class="eyebrow"><span class="eyebrow-line"></span> {{path.adjective.toUpperCase()}} LITTLE TRIVIA</p><h2>{{question.prompt}}</h2><p class="progress-label">QUESTION <strong>{{questionIndex + 1}}</strong> <i>/</i> {{path.questions.length}} &nbsp; · &nbsp; PULL CHANCE <strong>{{gachaChance}}%</strong></p><div class="progress-track"><span [style.width.%]="((questionIndex + 1) / path.questions.length) * 100"></span></div></div>
            <div class="question-layout">
              <div class="question-image question-image-left">
                @if (question.leftImage) { <img [src]="question.leftImage" [alt]="'Image for question ' + (questionIndex + 1)"> }
                @else { <span class="image-plus">＋</span><span class="image-label">QUESTION {{questionIndex + 1}}<br>LEFT IMAGE</span> }
              </div>
              <div class="question-card">
                <div class="answer-list">
                  @for (answer of question.answers; track answer; let i = $index) {
                    <button class="answer-button" [class.answer-right]="answerState !== 'idle' && i + 1 === question.correct" [class.answer-wrong]="answerState === 'wrong' && i === chosenAnswer" [disabled]="answerState !== 'idle'" (click)="answerQuestion(i)"><span class="answer-letter">{{letters[i]}}</span>{{answer}}<span class="answer-arrow">↗</span></button>
                  }
                </div>
                @if (answerState !== 'idle') { <p class="answer-feedback" [class.feedback-wrong]="answerState === 'wrong'">{{answerState === 'right' ? question.note : 'Not quite! Have another guess ✦'}}</p> }
                @if (answerState !== 'idle') { <button class="pill-button primary-button next-button" (click)="nextQuestion()">{{questionIndex + 1 === path.questions.length ? 'Go to the gacha' : 'Next question'}} <span>↗</span></button> }
              </div>
              <div class="question-image question-image-right">
                @if (question.rightImage) { <img [src]="question.rightImage" [alt]="'Image for question ' + (questionIndex + 1)"> }
                @else { <span class="image-plus">＋</span><span class="image-label">QUESTION {{questionIndex + 1}}<br>RIGHT IMAGE</span> }
              </div>
            </div>
          }
        }
      </section>

      <section class="game-stage" [class.stage-hidden]="page !== 'game'" aria-label="Birthday mini game">
        @if (selectedPath; as path) {
          <button class="text-back game-back" (click)="go('hub')">← ALL SIX ARTS</button>
          <p class="eyebrow"><span class="eyebrow-line"></span> {{path.theme.toUpperCase()}} GAME</p>
          @switch (path.game) {
            @case ('typing') {
              <h2>Fast fingers.<br><em>Type it perfectly.</em></h2>
              <p class="game-instructions">Type this sentence exactly. You get 5 seconds; after 3 tries, you’ll get 10. Each miss lowers your pull chance by 10 points (minimum 40%).</p>
              <p class="typing-sentence">{{path.typingSentence}}</p>
              <p class="game-stat">PULL CHANCE <strong>{{gachaChance}}%</strong> &nbsp; · &nbsp; ATTEMPT {{typingAttempts + 1}}</p>
              @if (typingPhase === 'ready') { <button class="pill-button primary-button" (click)="beginTyping()">Start typing <span>↗</span></button> }
              @if (typingPhase === 'playing') {
                <p class="game-timer">{{typingClockStarted ? typingSecondsLeft : 'READY'}}<small>{{typingClockStarted ? 'SECONDS' : 'TYPE TO START'}}</small></p>
                <input class="typing-input" [value]="typingText" (input)="updateTyping($event)" (keydown.enter)="submitTyping()" placeholder="Type the sentence here" autocomplete="off" spellcheck="false" aria-label="Type the birthday sentence">
                <button class="pill-button primary-button" [disabled]="!typingText" (click)="submitTyping()">Check my typing <span>↗</span></button>
              }
              @if (typingPhase === 'failed') { <p class="game-feedback failed-message">{{gameMessage}}</p><button class="pill-button primary-button" (click)="beginTyping()">Try again <span>↗</span></button> }
              @if (typingPhase === 'won') { <p class="game-feedback">{{gameMessage}}</p><button class="pill-button primary-button" (click)="startGacha()">Try your {{gachaChance}}% gacha <span>↗</span></button> }
            }
            @case ('bounce') {
              <h2>Bounce it<br><em>to the top!</em></h2><p class="game-instructions">Smash the space bar (or tap the button) to bounce the ball to the gold line. You have 10 seconds. Faster = better odds.</p>
              <p class="game-stat">PULL CHANCE <strong>{{gachaChance}}%</strong> &nbsp; · &nbsp; TIME {{gameSecondsLeft.toFixed(1)}}s</p>
              <div class="bounce-board"><div class="goal-line"></div><span class="goal-label">THE TOP</span><div class="bounce-ball" [style.bottom.%]="5 + bounceProgress * .8" [class.ball-bounce]="ballPopping"></div></div>
              @if (!gameRunning && !gameComplete) { <button class="pill-button primary-button" (click)="startBounce()">Start bouncing <span>↗</span></button> }
              @if (gameRunning) { <button class="pill-button primary-button" (click)="bounce()">Bounce! <span>↑</span></button> }
              @if (gameMessage) { <p class="game-feedback" [class.failed-message]="gameFailed">{{gameMessage}}</p> }
              @if (gameComplete && !gameFailed) { <button class="pill-button primary-button" (click)="startGacha()">Try your {{gachaChance}}% gacha <span>↗</span></button> }
              @if (gameFailed) { <button class="pill-button primary-button" (click)="startBounce()">Try again <span>↗</span></button> }
            }
            @case ('aim') {
              <h2>Quick!<br><em>Tap the target.</em></h2><p class="game-instructions">Click the target as many times as you can in 10 seconds. Each hit adds 10 percentage points, up to 70%.</p>
              <p class="game-stat">HITS <strong>{{aimClicks}}</strong> &nbsp; · &nbsp; PULL CHANCE <strong>{{gachaChance}}%</strong> &nbsp; · &nbsp; {{gameSecondsLeft.toFixed(1)}}s</p>
              <div class="aim-board"><button class="aim-target" [class.target-pop]="gameRunning" [style.left.%]="aimX" [style.top.%]="aimY" [disabled]="!gameRunning" (click)="clickTarget()" aria-label="Hit the target">✦</button>@if (!gameRunning && !gameComplete) { <span class="board-hint">Your target will pop up here</span> }</div>
              @if (!gameRunning && !gameComplete) { <button class="pill-button primary-button" (click)="startAim()">Start! <span>↗</span></button> }
              @if (gameMessage) { <p class="game-feedback">{{gameMessage}}</p> }
              @if (gameComplete) { <button class="pill-button primary-button" (click)="startGacha()">Try your {{gachaChance}}% gacha <span>↗</span></button> }
            }
            @case ('mole') {
              <h2>Whack the mole.<br><em>Get your art.</em></h2><p class="game-instructions">Tap the mole whenever it pops up. You have 15 seconds. Every hit adds 10 percentage points, up to 70%.</p>
              <p class="game-stat">HITS <strong>{{moleHits}}</strong> &nbsp; · &nbsp; PULL CHANCE <strong>{{gachaChance}}%</strong> &nbsp; · &nbsp; {{gameSecondsLeft.toFixed(1)}}s</p>
              <div class="mole-grid">@for (hole of moleHoles; track hole; let i = $index) { <button class="mole-hole" [class.mole-up]="moleIndex === i" (click)="hitMole(i)" [disabled]="!gameRunning" [attr.aria-label]="moleIndex === i ? 'Whack the mole' : 'Empty mole hole'">@if (moleIndex === i) { @if (path.media.moleImage) { <img [src]="path.media.moleImage" alt="Mole target"> } @else { <span>🐹</span> } }</button> }</div>
              @if (!gameRunning && !gameComplete) { <button class="pill-button primary-button" (click)="startMole()">Start whacking! <span>↗</span></button> }
              @if (gameMessage) { <p class="game-feedback">{{gameMessage}}</p> }
              @if (gameComplete) { <button class="pill-button primary-button" (click)="startGacha()">Try your {{gachaChance}}% gacha <span>↗</span></button> }
            }
          }
        }
      </section>

      <section class="gacha-stage" [class.stage-hidden]="page !== 'gacha'" aria-label="Three gacha pulls">
        @if (selectedPath; as path) {
          <button class="text-back game-back" (click)="go('hub')">← GIVE UP & CHOOSE AGAIN</button>
          <p class="eyebrow"><span class="eyebrow-line"></span> YOUR BIRTHDAY GACHA</p>
          <h2>{{path.name}}<br><em>art pull!</em></h2>
          <p class="game-stat">ODDS THIS PULL <strong>{{pullOdds}}%</strong> &nbsp; · &nbsp; PULL {{pullNumber}} / 3</p>
          @if (pityActive) { <p class="pity-note">Welcome back. Your next eligible pull is guaranteed to win.</p> }
          @if (rollState === 'idle' || rollState === 'ready') {
            <div class="gacha-capsule" [class.capsule-ready]="rollState === 'ready'">✦</div>
            <p class="game-instructions">{{rollState === 'idle' ? 'The first pull is a guaranteed miss. The next two use your odds.' : 'One more chance! Let’s see what you get.'}}</p>
            <button class="pill-button primary-button" (click)="beginPull()">{{rollState === 'idle' ? 'Pull #1 · guaranteed miss' : 'Pull #' + pullNumber}} <span>↗</span></button>
          }
          @if (rollState === 'pulling' || rollState === 'losing') {
            <div class="pull-stage">
              @if (rollVideoSrc) { <video class="pull-video" [src]="rollVideoSrc" autoplay playsinline (ended)="rollState === 'pulling' ? finishPullVideo() : finishLossVideo()" (error)="rollState === 'pulling' ? finishPullVideo() : finishLossVideo()"></video> }
              @else { <div class="gacha-capsule" [class.capsule-spinning]="rollState === 'pulling'">{{rollState === 'pulling' ? '✦' : '…'}}</div><p class="pull-result-text">{{rollState === 'pulling' ? 'PULLING…' : 'SO CLOSE…'}}</p> }
              @if (rollState === 'losing' && showLostStamp) { <div class="lost-result"><strong class="roll-stamp lost-stamp">LOST</strong><p class="game-stat">{{rollSummary}}</p></div> }
            </div>
            <button class="continue-pull" (click)="skipRollVideo()">Skip video ↗</button>
          }
          @if (rollState === 'won') { <div class="roll-result"><strong class="roll-stamp win-stamp">WIN</strong><p class="game-stat">{{rollSummary}}</p><button class="pill-button primary-button" (click)="claimWin()">Reveal the art <span>✦</span></button></div> }
          @if (rollState === 'lost') { <div class="loss-card"><span>✧</span><h3>Not this time!</h3><p>Luck is fickle. You can head back and try another art path.</p><button class="pill-button primary-button" (click)="go('hub')">Back to the six arts <span>↗</span></button></div> }
        }
      </section>

      <section class="reward-stage" [class.stage-hidden]="page !== 'reward'" aria-label="Your birthday art reward">
        @if (selectedPath; as path) {
          <p class="eyebrow"><span class="eyebrow-line"></span> YOU GOT THE ART, XENIA <span class="sparkle">✦</span></p>
          <h2>Gacha hit!<br><em>It’s yours.</em></h2>
          <p class="reward-note">{{path.rewardNote}}</p>
          <div class="reward-gallery">
            @for (art of rewardArts; track art.image) {
              <article class="reward-piece">
                <div class="reward-art" [style.--swatch]="path.color" [style.--swatch-text]="path.swatchText">
                  <div class="art-halo"></div>
                  @if (art.image) { <img class="reward-image" [src]="art.image" [alt]="path.rewardTitle"> }
                  @else { <div class="art-shape">{{path.art}}</div> }
                </div>
                <blockquote class="artist-quote reward-quote">{{art.artistQuote || 'Add the artist’s quote here'}}</blockquote><p class="artist-credit">{{art.artistCredit || 'Add artist credit'}}</p>
              </article>
            }
          </div>
          <p class="art-title">{{path.rewardTitle}} <span>✦</span></p>
          <div class="reward-actions"><button class="pill-button primary-button" (click)="go('hub')">Choose another art <span>↗</span></button><button class="restart-link" (click)="go('welcome')">Start the birthday all over again ↗</button></div>
        }
      </section>
      
    </main>
  `,
})
export class AppComponent implements OnDestroy {
  constructor(private readonly changeDetector: ChangeDetectorRef) {}
  page: Page = 'welcome';
  selectedColor: ColorKey | null = null;
  rewardArts: ArtReward[] = [];
  questionIndex = 0;
  answerState: 'idle' | 'right' | 'wrong' = 'idle';
  chosenAnswer = -1;
  gachaChance = 0;
  pityActive = false;
  readonly letters = ['A', 'B', 'C'];
  readonly paths = BIRTHDAY_PATHS;
  readonly colorEntries = (Object.entries(BIRTHDAY_PATHS) as [ColorKey, ColorPath][]).map(([key, path]) => ({ key, path }));

  // These are your existing image choices and edited labels. Kept as provided.
  readonly welcomePhotos = [
    { label: 'Bad Boi', alt: 'Birthday memory one', src: 'images/WelcomePage/Sylus.jpg' },
    { label: 'Good Doctor', alt: 'Birthday memory two', src: 'images/WelcomePage/Luuk.jpg' },
    { label: 'Vampire Daddy', alt: 'Birthday memory three', src: 'images/WelcomePage/Hugo.jpg' },
    { label: 'Idk anything about daddy', alt: 'Birthday memory four', src: 'images/WelcomePage/Chaos.jpg' },
  ];
  readonly teasePhotos = [
    { alt: 'A funny photo of Xenia', src: 'images/TeasePage/TeasePic.jpg', comment: 'EWWWW LADS!' },
    { alt: 'Another funny photo of Xenia', src: 'images/TeasePage/Tease2.jpg', comment: 'Your fav YOAI' },
  ];

  readonly moleHoles = Array.from({ length: 9 }, (_, i) => i);
  gameRunning = false;
  gameComplete = false;
  gameFailed = false;
  gameMessage = '';
  gameSecondsLeft = 0;
  typingPhase: 'ready' | 'playing' | 'failed' | 'won' = 'ready';
  typingText = '';
  typingAttempts = 0;
  typingSecondsLeft = 5;
  typingClockStarted = false;
  bounceProgress = 0;
  ballPopping = false;
  aimClicks = 0;
  aimX = 50;
  aimY = 50;
  moleHits = 0;
  moleIndex = -1;
  pullNumber = 1;
  lastPullWon = false;
  rollVideoSrc = '';
  rollState: 'idle' | 'ready' | 'pulling' | 'losing' | 'won' | 'lost' = 'idle';
  rollSummary = '';
  showLostStamp = false;
  musicVolume = 0.35;
  musicMuted = false;
  private readonly backgroundMusic = new Audio('media/music/background-loop.mp3');
  private musicStarted = false;
  private roll = 0;
  private guaranteedWin = false;

  private timer: ReturnType<typeof setInterval> | null = null;
  private moleTimer: ReturnType<typeof setTimeout> | null = null;
  private pullFallback: ReturnType<typeof setTimeout> | null = null;
  private lostStampTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly audioCache = new Map<string, HTMLAudioElement>();
  private gameStartedAt = 0;

  get selectedPath(): ColorPath | null { return this.selectedColor ? BIRTHDAY_PATHS[this.selectedColor] : null; }
  get currentQuestion(): TriviaQuestion | null { return this.selectedPath?.questions[this.questionIndex] ?? null; }
  get pullOdds(): number { return this.pullNumber === 1 ? 0 : this.pityActive ? 100 : this.gachaChance; }
  private get typingDuration(): number { return this.typingAttempts > 3 ? 10 : 5; }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKey(event: KeyboardEvent): void {
    this.startBackgroundMusic();
    if (event.code === 'Space' && this.page === 'game' && this.selectedPath?.game === 'bounce' && this.gameRunning) {
      event.preventDefault();
      this.bounce();
    }
  }

  @HostListener('window:pointerdown')
  handleFirstPointer(): void { this.startBackgroundMusic(); }

  toggleMusic(): void {
    this.musicMuted = !this.musicMuted;
    this.backgroundMusic.muted = this.musicMuted;
    if (!this.musicMuted) this.startBackgroundMusic();
  }

  setMusicVolume(event: Event): void {
    this.musicVolume = Number((event.target as HTMLInputElement).value);
    this.backgroundMusic.volume = this.musicVolume;
  }

  private startBackgroundMusic(): void {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.musicVolume;
    this.backgroundMusic.muted = this.musicMuted;
    if (this.musicStarted || this.musicMuted) return;
    void this.backgroundMusic.play().then(() => { this.musicStarted = true; }).catch(() => undefined);
  }

  ngOnDestroy(): void { this.clearTimers(); this.backgroundMusic.pause(); }

  go(page: Page, event?: Event): void {
    event?.preventDefault();
    if (this.page === 'gacha' && (this.rollState === 'ready' || this.rollState === 'lost' || ((this.rollState === 'pulling' || this.rollState === 'losing') && !this.lastPullWon))) this.savePity();
    if (page === 'hub') this.resetChallenge();
    this.page = page;
    this.answerState = 'idle';
    this.chosenAnswer = -1;
  }

  chooseColor(color: ColorKey): void {
    this.resetChallenge();
    this.selectedColor = color;
    const path = this.selectedPath;
    if (!path) return;
    this.pityActive = this.hasPity(color);
    this.gachaChance = path.game === 'quiz' ? 0 : 70;
    this.page = path.game === 'quiz' ? 'trivia' : 'game';
  }

  answerQuestion(answer: number): void {
    const question = this.currentQuestion;
    if (!question) return;
    this.chosenAnswer = answer;
    this.answerState = question.correct === answer + 1 ? 'right' : 'wrong';
    if (this.answerState === 'right') this.gachaChance = Math.min(70, this.gachaChance + 23);
    else this.playSound(this.selectedPath?.media.loseAudio);
    if (this.answerState === 'right') this.playSound(this.selectedPath?.media.gameAudio);
  }

  nextQuestion(): void {
    const path = this.selectedPath;
    if (!path) return;
    if (this.questionIndex + 1 >= path.questions.length) { this.startGacha(); return; }
    this.questionIndex++;
    this.answerState = 'idle';
    this.chosenAnswer = -1;
  }

  beginTyping(): void {
    this.clearTimer();
    this.playSound(this.selectedPath?.media.gameAudio);
    this.typingText = '';
    this.typingAttempts++;
    this.typingSecondsLeft = this.typingDuration;
    this.typingClockStarted = false;
    this.gameMessage = '';
    this.typingPhase = 'playing';
    setTimeout(() => document.querySelector<HTMLInputElement>('.typing-input')?.focus(), 0);
  }

  updateTyping(event: Event): void {
    this.typingText = (event.target as HTMLInputElement).value;
    if (!this.typingClockStarted && this.typingText.length > 0) this.startTypingClock();
    const sentence = this.selectedPath?.typingSentence;
    if (sentence && this.normalizeTyping(this.typingText) === this.normalizeTyping(sentence)) this.finishTyping();
  }

  private startTypingClock(): void {
    this.typingClockStarted = true;
    this.gameStartedAt = Date.now();
    this.timer = setInterval(() => {
      const elapsed = (Date.now() - this.gameStartedAt) / 1000;
      this.typingSecondsLeft = Math.max(0, Math.ceil(this.typingDuration - elapsed));
      this.changeDetector.markForCheck();
      if (elapsed >= this.typingDuration) this.failTyping('Time is up! The next try costs 10 pull points.');
    }, 100);
  }

  private normalizeTyping(value: string): string { return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase(); }

  submitTyping(): void {
    if (this.typingPhase !== 'playing') return;
    const path = this.selectedPath;
    if (!path?.typingSentence) return;
    if (this.normalizeTyping(this.typingText) === this.normalizeTyping(path.typingSentence)) this.finishTyping();
    else this.failTyping('A spelling or punctuation slip! That try costs 10 pull points.');
  }

  private finishTyping(): void {
    this.clearTimer();
    this.typingPhase = 'won';
    this.gameMessage = `Perfect! You kept ${this.gachaChance}% pull odds.`;
    this.playSound(this.selectedPath?.media.gameAudio);
  }

  private failTyping(message: string): void {
    this.clearTimer();
    this.gachaChance = Math.max(40, this.gachaChance - 10);
    this.typingPhase = 'failed';
    this.gameMessage = message;
    this.playSound(this.selectedPath?.media.loseAudio);
    this.changeDetector.markForCheck();
  }

  startBounce(): void {
    this.clearTimers();
    this.gameRunning = true;
    this.gameComplete = false;
    this.gameFailed = false;
    this.gameMessage = '';
    this.bounceProgress = 0;
    this.gachaChance = 70;
    this.startClock(10, () => {
      this.gameRunning = false;
      this.gameFailed = true;
      this.bounceProgress = 0;
      this.gameMessage = 'That took over 10 seconds. Try again!';
    });
    this.playSound(this.selectedPath?.media.gameAudio);
  }

  bounce(): void {
    if (!this.gameRunning) return;
    this.bounceProgress = Math.min(100, this.bounceProgress + 12.5);
    this.ballPopping = true;
    setTimeout(() => this.ballPopping = false, 160);
    this.playSound(this.selectedPath?.media.gameAudio);
    if (this.bounceProgress >= 100) {
      const seconds = Math.min(10, (Date.now() - this.gameStartedAt) / 1000);
      this.gachaChance = Math.max(40, Math.min(70, Math.round(70 - (seconds / 10) * 30)));
      this.gameRunning = false;
      this.gameComplete = true;
      this.gameMessage = `Top reached in ${seconds.toFixed(1)} seconds. Pull chance: ${this.gachaChance}%.`;
      this.clearTimer();
    }
  }

  startAim(): void {
    this.clearTimers();
    this.aimClicks = 0;
    this.gachaChance = 0;
    this.gameComplete = false;
    this.gameMessage = '';
    this.gameRunning = true;
    this.setAimPosition();
    this.startClock(10, () => {
      this.gameRunning = false;
      this.gameComplete = true;
      this.gachaChance = Math.min(70, this.aimClicks * 10);
      this.gameMessage = `${this.aimClicks} hits = ${this.gachaChance}% pull chance!`;
    });
    this.playSound(this.selectedPath?.media.gameAudio);
  }

  clickTarget(): void {
    if (!this.gameRunning) return;
    this.aimClicks++;
    this.gachaChance = Math.min(70, this.aimClicks * 10);
    this.setAimPosition();
    this.playSound(this.selectedPath?.media.gameAudio);
  }

  private setAimPosition(): void {
    this.aimX = 8 + Math.random() * 82;
    this.aimY = 10 + Math.random() * 72;
  }

  startMole(): void {
    this.clearTimers();
    this.moleHits = 0;
    this.moleIndex = -1;
    this.gachaChance = 0;
    this.gameRunning = true;
    this.gameComplete = false;
    this.gameMessage = '';
    this.showMole();
    this.scheduleMole(520);
    this.startClock(15, () => {
      this.gameRunning = false;
      this.gameComplete = true;
      this.moleIndex = -1;
      this.clearMoleTimer();
      this.gachaChance = Math.min(70, this.moleHits * 10);
      this.gameMessage = `${this.moleHits} moles whacked = ${this.gachaChance}% pull chance!`;
    });
    this.playSound(this.selectedPath?.media.gameAudio);
  }

  hitMole(index: number): void {
    if (!this.gameRunning || index !== this.moleIndex) return;
    this.moleHits++;
    this.gachaChance = Math.min(70, this.moleHits * 10);
    this.moleIndex = -1;
    this.scheduleMole(180);
    this.playSound(this.selectedPath?.media.gameAudio);
  }

  private showMole(): void {
    const next = Math.floor(Math.random() * this.moleHoles.length);
    this.moleIndex = next === this.moleIndex ? (next + 1) % this.moleHoles.length : next;
  }

  private scheduleMole(delay = 850): void {
    this.clearMoleTimer();
    this.moleTimer = setTimeout(() => {
      if (!this.gameRunning) return;
      this.showMole();
      this.changeDetector.markForCheck();
      this.scheduleMole();
    }, delay);
  }

  private startClock(seconds: number, done: () => void): void {
    this.clearTimer();
    this.gameStartedAt = Date.now();
    this.gameSecondsLeft = seconds;
    this.timer = setInterval(() => {
      const elapsed = (Date.now() - this.gameStartedAt) / 1000;
      this.gameSecondsLeft = Math.max(0, seconds - elapsed);
      this.changeDetector.markForCheck();
      if (elapsed >= seconds) { this.clearTimer(); done(); this.changeDetector.markForCheck(); }
    }, 100);
  }

  startGacha(): void {
    this.clearTimers();
    this.page = 'gacha';
    this.pullNumber = 1;
    this.rollState = 'idle';
    this.rollVideoSrc = '';
  }

  beginPull(): void {
    const path = this.selectedPath;
    if (!path || this.rollState === 'pulling' || this.rollState === 'losing' || this.rollState === 'lost') return;
    this.guaranteedWin = this.pullNumber > 1 && this.pityActive;
    this.roll = Math.floor(Math.random() * 100) + 1;
    this.lastPullWon = this.pullNumber > 1 && (this.guaranteedWin || this.roll <= this.gachaChance);
    this.rollSummary = this.pullNumber === 1
      ? 'First pull: guaranteed miss.'
      : this.guaranteedWin
        ? `Retry guarantee activated · ${this.gachaChance}% base odds.`
        : `${this.gachaChance}% chance · roll ${this.roll}/100.`;
    this.rollState = 'pulling';
    this.showLostStamp = false;
    this.rollVideoSrc = path.media.pullVideo;
    this.playSound(path.media.gachaAudio);
    this.pullFallback = setTimeout(() => this.finishPullVideo(), this.rollVideoSrc ? 30000 : 1800);
  }

  finishPullVideo(): void {
    if (this.rollState !== 'pulling') return;
    if (this.pullFallback) clearTimeout(this.pullFallback);
    this.pullFallback = null;
    const path = this.selectedPath;
    if (this.lastPullWon) {
      this.playSound(path?.media.winAudio);
      this.clearPity();
      if (path?.arts.length) this.rewardArts = this.selectedColor === 'indigo'
        ? [...path.arts]
        : [path.arts[Math.floor(Math.random() * path.arts.length)]];
      this.rollState = 'won';
      this.changeDetector.markForCheck();
      return;
    }
    this.rollState = 'losing';
    this.showLostStamp = false;
    this.lostStampTimer = setTimeout(() => {
      this.showLostStamp = true;
      this.changeDetector.markForCheck();
    }, 1000);
    this.rollVideoSrc = path?.media.loseVideo ?? '';
    this.playSound(path?.media.loseAudio);
    this.pullFallback = setTimeout(() => this.finishLossVideo(), this.rollVideoSrc ? 30000 : 1800);
    this.changeDetector.markForCheck();
  }

  finishLossVideo(): void {
    if (this.rollState !== 'losing') return;
    if (this.pullFallback) clearTimeout(this.pullFallback);
    this.pullFallback = null;
    this.rollVideoSrc = '';
    if (this.lostStampTimer) clearTimeout(this.lostStampTimer);
    this.lostStampTimer = null;
    this.showLostStamp = false;
    if (this.pullNumber >= 3) { this.rollState = 'lost'; this.savePity(); }
    else { this.pullNumber++; this.rollState = 'ready'; }
    this.changeDetector.markForCheck();
  }

  skipRollVideo(): void {
    if (this.rollState === 'pulling') this.finishPullVideo();
    else if (this.rollState === 'losing') this.finishLossVideo();
  }

  claimWin(): void { if (this.rollState === 'won') this.page = 'reward'; }

  private playSound(src?: string): void {
    if (!src) return;
    let audio = this.audioCache.get(src);
    if (!audio) {
      audio = new Audio(src);
      this.audioCache.set(src, audio);
    }
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.65;
    void audio.play().catch(() => undefined);
  }

  private stopSounds(): void {
    for (const audio of this.audioCache.values()) { audio.pause(); audio.currentTime = 0; }
  }

  resetPity(): void {
    for (const color of Object.keys(BIRTHDAY_PATHS) as ColorKey[]) {
      try { localStorage.removeItem(this.pityKey(color)); } catch { /* Storage can be unavailable in private browsing. */ }
    }
    this.pityActive = false;
  }

  private pityKey(color: ColorKey): string { return `xen-birthday-pity-${color}`; }
  private hasPity(color: ColorKey): boolean {
    try { return typeof localStorage !== 'undefined' && localStorage.getItem(this.pityKey(color)) === 'true'; }
    catch { return false; }
  }
  private savePity(): void {
    if (!this.selectedColor) return;
    try { localStorage.setItem(this.pityKey(this.selectedColor), 'true'); this.pityActive = true; }
    catch { this.pityActive = true; }
  }
  private clearPity(): void {
    if (!this.selectedColor) return;
    try { localStorage.removeItem(this.pityKey(this.selectedColor)); } catch { /* Storage can be unavailable in private browsing. */ }
    this.pityActive = false;
  }

  private resetChallenge(): void {
    this.clearTimers();
    this.stopSounds();
    this.selectedColor = null;
    this.rewardArts = [];
    this.showLostStamp = false;
    this.questionIndex = 0;
    this.answerState = 'idle';
    this.chosenAnswer = -1;
    this.gachaChance = 0;
    this.pityActive = false;
    this.gameRunning = false;
    this.gameComplete = false;
    this.gameFailed = false;
    this.gameMessage = '';
    this.typingPhase = 'ready';
    this.typingText = '';
    this.typingAttempts = 0;
    this.typingClockStarted = false;
    this.bounceProgress = 0;
    this.aimClicks = 0;
    this.moleHits = 0;
    this.moleIndex = -1;
    this.rollState = 'idle';
    this.pullNumber = 1;
    this.rollVideoSrc = '';
  }

  private clearTimer(): void { if (this.timer) clearInterval(this.timer); this.timer = null; }
  private clearMoleTimer(): void { if (this.moleTimer) clearTimeout(this.moleTimer); this.moleTimer = null; }
  private clearTimers(): void {
    this.clearTimer();
    this.clearMoleTimer();
    if (this.pullFallback) clearTimeout(this.pullFallback);
    this.pullFallback = null;
    if (this.lostStampTimer) clearTimeout(this.lostStampTimer);
    this.lostStampTimer = null;
  }
}
