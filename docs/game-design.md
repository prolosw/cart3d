# Number Monster Adventure Game Design

## 1. Product Vision

`Number Monster Adventure` is a mobile-first 2D RPG where children strengthen early math skills through fast monster battles, collecting, and progression. The educational layer should feel embedded inside the fantasy loop rather than presented as a lesson.

## 2. Target Audience

- Primary: children ages 5-10
- Secondary: parents looking for light educational value
- Session style: short bursts during commutes, waiting time, or free play

## 3. Experience Goals

- Make the child feel clever and successful
- Reward play every session, even in short bursts
- Keep interactions simple enough for early readers
- Avoid failure loops that feel punishing or academic

## 4. Core Gameplay Loop

### Battle Flow

1. Player enters a stage
2. Enemy monster appears with a target number
3. Player taps one or more number buttons to build the answer
4. Correct answer damages the enemy
5. Wrong answer causes a light enemy attack or missed turn
6. Battle ends in victory, retry, or assist mode
7. Rewards are granted
8. Progress feeds monster growth, eggs, and unlocks

### Session Goal

- One stage should last about 30-60 seconds
- A 5-minute session should complete several stages and at least one meaningful reward event

## 5. Number Puzzle Battle System

### Base Rule

Each battle presents a target number. The child selects numbers that match the requested result.

Example:

- Target number: `10`
- Buttons shown: `2, 3, 5, 7, 8`
- Correct choice: `3 + 7 = 10`

### Puzzle Inputs by Progression

- Early game: tap the matching number
- Mid game: tap two numbers that add to the target
- Later game: addition and subtraction expressions
- Advanced game: simple multiplication

### Battle Resolution

- Correct answer: enemy takes damage, player monster animates, reward meter fills
- Fast correct streak: bonus damage or coin multiplier
- Incorrect answer: enemy attacks, but damage stays soft and forgiving
- Near miss support: optional hint sparkles after repeated mistakes

### Accessibility Rules

- Large number buttons
- Very limited clutter on screen
- Strong color separation
- Spoken target number option
- Optional assist mode after repeated failures

## 6. Difficulty Progression

### Level 1-10: Number Recognition

- Goal: recognize and match numbers `1-10`
- Interaction: tap the target number
- Time pressure: none or extremely low

### Level 11-30: Addition

- Goal: combine two values to match a target
- Example: `4 + 5 = 9`
- Introduce combo feedback and simple streak rewards

### Level 31-60: Addition and Subtraction

- Goal: solve one-step math expressions
- Examples: `12 - 4`, `6 + 7`
- Introduce enemy abilities that change button sets

### Level 61+: Multiplication

- Goal: solve very simple multiplication
- Examples: `2 x 3`, `4 x 5`
- Keep results small and readable for the age group

## 7. Battle Structure

### Combat Stats

Each monster should have:

- HP
- Attack power
- Puzzle difficulty tag
- Reward tier

### Recommended Encounter Length

- Standard enemy: 2-3 correct answers
- Elite enemy: 4-5 correct answers
- Boss enemy: 5-7 correct answers with visual phase changes

### Failure Design

- Do not fully block children for repeated mistakes
- Offer a lighter retry or helper effect
- Guarantee some progress, such as egg warm-up or tiny coin gain

## 8. Monster Collection System

### Player Monster Features

- Level
- Experience
- Evolution stage
- Element or world theme
- One signature animation

### Sample Evolution Line

- Level 1: Small Slime
- Level 10: Jump Slime
- Level 20: Number Slime
- Level 40: Slime King

### Collection Goals

- Encourage favorites, not just strongest picks
- Make rare finds exciting but not required
- Use silhouette slots and hatch teases to motivate continued play

## 9. Egg and Hatching System

### Egg Sources

- Stage clear rewards
- Boss rewards
- Daily login rewards
- World completion milestones

### Egg Rarities

- Common Egg
- Rare Egg
- Legendary Egg

### Hatch Rules

- Eggs hatch after a number of battles instead of real-time waiting
- Visible progress meter increases after every stage
- Hatching animation should be short, magical, and celebratory

### Hatching UX

- Egg wiggle
- Glow crack
- Burst reveal
- Monster cheer pose
- Quick summary of rarity and new collection status

## 10. Rewards and Economy

### Main Rewards

- Coins
- Monster experience
- Eggs
- Cosmetics
- World unlock keys or stars

### Economy Principles

- Every battle should reward something
- Premium monetization should stay cosmetic-only
- Children should not hit long grind walls in the first several worlds

## 11. World Structure

### World 1: Number Forest

- Theme: bright grass, leaves, soft critters
- Math focus: number recognition

### World 2: Addition Cave

- Theme: crystals, tunnels, glowing rocks
- Math focus: simple addition

### World 3: Subtraction Desert

- Theme: sand dunes, ruins, treasure bones
- Math focus: subtraction and mixed operations

### World 4: Multiplication Volcano

- Theme: lava, smoke puffs, fire creatures
- Math focus: multiplication

### World 5: Space Math Galaxy

- Theme: stars, comets, floating islands
- Math focus: mixed mastery and special encounters

## 12. Player Customization

Unlockable cosmetics:

- Hats
- Costumes
- Trail effects
- Pets

Design rule:

- Cosmetics should be visible during exploration, battle intros, and result screens

## 13. UI and UX

### Main Battle Screen

Must show:

- Player monster
- Enemy monster
- Target number or expression
- Number buttons
- HP bars
- Reward preview

### Kid-Friendly UI Rules

- Use large tap zones
- Limit text density
- Prioritize icons and animation cues
- Keep menus shallow
- Confirm purchases with parent gate if monetization exists

## 14. Audio Direction

### Audio Goals

- Reinforce success
- Keep energy cheerful and gentle
- Avoid scary failure sounds

### Key Sounds

- Correct answer: bright chime
- Wrong answer: soft pop or wobble
- Level up: celebration sting
- Egg hatch: magical sparkle swell
- Evolution: big reveal fanfare

## 15. Monetization Rules

Allowed:

- Monster skins
- Character outfits
- Special egg packs
- Remove ads

Not allowed:

- Stat boosts for money
- Exclusive power locked behind spending
- Progress blockers that push payment

## 16. Retention Features

- Daily login gifts
- Simple quest board
- Sticker book or monster journal
- Limited-time cosmetic events
- World bosses with guaranteed egg progress

## 17. Live Ops Safety for Kids

- No aggressive timers
- No fear-of-missing-out pressure
- No competitive chat
- No public social features by default

## 18. MVP Scope Recommendation

For a first playable build, include:

- 1 world
- 10-15 stages
- 6-8 monsters
- 1 egg type plus 1 rare egg chance
- Number recognition and simple addition only
- One monster evolution line
- Basic coins, exp, and stage unlocks

This keeps the first version achievable while preserving the core fun of battle, collecting, and progression.
