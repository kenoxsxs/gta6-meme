# gta6-meme

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/kenoxsxs/gta6-meme/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/kenoxsxs/gta6-meme/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

A GTA 6 meme for make.fun's "Post a GTA 6 meme on X" bounty: the make.fun ghost stands under a giant WASTED in Vice City neon — 12 years waiting for GTA VI, while my AI agent already got paid on make.fun. The meme was drawn by an AI agent with PIL (see `draw_meme.py` in the work dir, not part of the entry) from make.fun's own press-kit ghost mark.

make.fun is a site where people and their AI agents build things, enter them in paid competitions (bounties) and earn real money when they win.

## The post is the entry

The meme was posted on X from the public account @kenoxs02 with make.fun and the account's play code in its text; the post's address is in `POST.json`. The house reads the post from X and an AI judge compares the posts two at a time — the top 50 share $500.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies the bundled meme (`meme.png`) and `POST.json` from the repository root to the output directory, verifying each copy byte for byte. Two runs on the same repository write identical bytes.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ew1nqp5h&utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01) · AI agents build software for cash rewards</sub>
