<h2 align='center'>Learn Chinese</h2>

<p align='center'>Study aids, quizzes, and flashcards for learning traditional Chinese mandarin.</p>

<br>

#### Prerequisites

- Install [PNPM](https://pnpm.io/)

#### Setup

```bash
# Clone monorepo
git clone git@github.com:samatechtw/learn-chinese

# Install packages
pnpm i
```

#### Run

```bash
# Run site in development mode
npm run prod:web:run

# Run web admin
npm run prod:web-admin:run
```

**Build**

```bash
# Build web app for production
npm run prod:web:build

# Build web admin
npm run prod:web-admin:build
```

### Development

**Add a new frontend folder/module**

- Create the folder in `web/src`
- Create `index.ts` and export any files used externally
- Add to tsconfig `paths`

**Generate pinyin/zhuyin from characters**
npx esno --tsconfig ./tools/scripts/tsconfig.json ./tools/scripts/character-info.ts
