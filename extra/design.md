# KSIJ Community Website — Design System

**Status:** v1.0  
**Purpose:** Single source of truth for UI/UX and frontend design across the team and AI coding/design agents.

---

## 1. Product Context

This is a community-focused digital platform for the Khoja community.

The website should help community members:

- Learn about the community
- Discover useful community resources
- Find people and services within the community
- Access community guidelines, opportunities, scholarships, offers, and announcements
- Navigate multiple community services from one consistent platform

The overall experience should feel:

**Trustworthy · Welcoming · Informative · Modern · Simple · Community-first**

This is primarily an **informational + utility platform**, not a marketing landing page.

---

## 2. Design Philosophy

### Primary philosophy: Flat Design

Use a clean, modern flat design system with:

- Solid colors
- Clear typography
- Simple geometric shapes
- Minimal shadows
- Minimal gradients
- Strong spacing
- Clear visual hierarchy
- Simple icons
- Functional interactions

### Avoid

- Glassmorphism
- Heavy neumorphism
- Excessive gradients
- 3D UI elements
- Excessive animations
- Overly decorative cards
- Dark-mode-first visual treatment
- Generic SaaS dashboard aesthetics
- Excessive rounded/pill-shaped components

### Visual Direction

Think:

> **Modern community institution + digital utility platform**

The website should feel established and reliable while still looking contemporary.

---

# 3. Brand Colors

## Primary Green

**HEX:** `#098231`

Use for:

- Navbar
- Primary headings where appropriate
- Primary buttons
- Footer
- Important UI sections
- Icons and accents
- Active navigation states

This is the main brand color.

## Primary Light / White

**HEX:** `#E1DFDA`

Use as:

- Main page background
- Large section backgrounds
- Cards where appropriate
- Negative space
- Secondary surfaces

This should create a warm, slightly off-white appearance rather than a pure-white interface.

## Supporting Colors

Use supporting colors sparingly.

### Text

Primary text:
`#098231` or Black

Secondary text:
Use a muted green/gray derived from the primary palette.

Do not introduce random colors without a design-system reason.

### Status colors

For functional states only:

- Success: muted green
- Warning: muted amber
- Error: muted red
- Information: muted blue

Status colors should never compete with the brand green.

---

# 4. Color Usage Ratio

Approximate visual balance:

- **60–70%:** `#E1DFDA`
- **20–30%:** `#098231`
- **5–10%:** supporting neutrals/status colors

The website should NOT look like a green website with white text everywhere.

The green should be used strategically to create hierarchy.

---

# 5. Typography

Use a modern, highly readable sans-serif font.

Recommended primary font:

**Inter**

Fallback:

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Typography hierarchy

#### Display / Hero

Large, bold, short headlines.

Example:

> Built for the community.

#### H1

Large and strong.

#### H2

Clear section headings.

#### H3

Card and subsection headings.

#### Body

Comfortable reading width and generous line height.

#### Small text

Use only for metadata, labels, timestamps, categories, etc.

### Typography rules

- Prioritize readability.
- Avoid overly condensed fonts.
- Avoid decorative fonts for general content.
- Avoid excessive uppercase text.
- Use font weight to establish hierarchy rather than many different font families.

---

# 6. Layout System

Use a consistent max-width container.

Recommended:

```css
max-width: 1200px;
margin: 0 auto;
padding-inline: 24px;
```

For larger screens:

```css
padding-inline: 32px;
```

### Grid

Use a flexible 12-column mental grid.

Common layouts:

- 2-column hero
- 3-column feature grid
- 4-column directory grid
- 2-column informational sections
- Full-width content sections

Do not create a unique layout for every section unless there is a strong UX reason.

---

# 7. Spacing System

Use a consistent spacing scale.

Recommended base:

```text
4
8
12
16
24
32
48
64
80
96
120
```

Prefer these values over arbitrary spacing.

### Section spacing

Desktop:

```text
80–120px
```

Mobile:

```text
48–72px
```

The site should have generous whitespace.

---

# 8. Border Radius

Use restrained rounding.

Recommended:

```text
Small UI elements: 6–8px
Cards: 10–14px
Large containers: 16px
```

Avoid extremely rounded cards and excessive pill shapes.

Buttons may use moderate rounding, but should not automatically become pills.

---

# 9. Borders & Shadows

### Borders

Use subtle borders for separation:

```css
border: 1px solid rgba(9, 35, 31, 0.12);
```

### Shadows

Use shadows minimally.

Preferred:

- Mostly flat surfaces
- Very subtle elevation only where necessary
- No large floating shadows

The interface should communicate hierarchy primarily through:

**spacing + typography + color + borders**

rather than shadows.

---

# 10. Navbar

The navbar is a major brand element.

### Structure

Left:

- Community logo

Center/right:

- Home
- K Connect
- K Guide
- Other major sections
- Primary action if required

### Behavior

Desktop:

- Horizontal navigation
- Clear active state
- Stable height
- Minimal decoration

Mobile:

- Logo
- Menu button
- Slide/dropdown navigation

### Active state

The current page should be immediately identifiable.

Use:

- Green text
- Green underline
- Subtle background
- Or another restrained brand treatment

Do not use multiple active-state effects simultaneously.

---

# 11. Buttons

### Primary Button

Background:

`#098231`

Text:

`#E1DFDA`

Use for important actions.

Examples:

- Explore K Connect
- View Directory
- Learn More
- Explore Guidelines

### Secondary Button

Transparent/light background with green border or text.

### Rules

- Buttons should be clearly actionable.
- Use short labels.
- Avoid excessive buttons in one section.
- Do not make every card contain a button.

---

# 12. Cards

Cards are allowed but should be functional.

Use cards for:

- Directory profiles
- Community services
- Guides
- Opportunities
- Announcements
- Categories
- Events

### Card structure

```text
[Icon / Image]

Category

Title

Short description

Optional metadata

Optional action
```

### Card rules

- Consistent padding
- Consistent border radius
- Clear hierarchy
- Minimal shadow
- No excessive decorative graphics
- Avoid making every section a card grid

---

# 13. Iconography

Use one consistent icon library.

Recommended:

**Lucide Icons**

Rules:

- Use outline icons
- Consistent stroke width
- Avoid mixing icon styles
- Do not use emojis as UI icons
- Icons should support meaning, not decorate empty space

---

# 14. Imagery

Photography should feel authentic to the community.

Prefer:

- Community events
- People
- Real activities
- Educational events
- Community gatherings
- Services and initiatives

Avoid:

- Generic corporate stock photography
- Random AI-generated people
- Overly staged business imagery

Images should support the content rather than dominate it.

---

# 15. Home Page Structure

The homepage should be informative and easy to understand.

Suggested structure:

```text
Navbar
↓
Hero / Community Introduction
↓
Quick Access / Key Services
↓
K Connect Introduction
↓
K Guide Introduction
↓
Community Information / Highlights
↓
Opportunities / Announcements
↓
Additional Community Services
↓
Footer
```

The homepage should answer quickly:

1. What is this website?
2. Who is it for?
3. What can I do here?
4. Where should I go next?

---

# 16. K Connect

K Connect is the community directory platform.

It should allow members to discover people/services within the community.

Potential categories:

- Engineers
- Doctors
- Lawyers
- Teachers
- Business owners
- Plumbers
- Electricians
- Technicians
- Service providers
- Professionals
- Other community members/services

### UX goal

A user should be able to:

```text
Open K Connect
→ Select/search a category
→ Search a person/service
→ View profile
→ Access relevant contact/details
```

### Important

Do not design K Connect like a generic social network.

It is a **community directory and utility platform**.

---

# 17. K Guide

K Guide is the community information and guidance platform.

Possible content:

- Community guidelines
- Scholarships
- Opportunities
- Offers
- Important procedures
- Community resources
- Frequently asked questions
- Useful documents
- Announcements

### UX goal

Information should be:

**Searchable → Categorized → Easy to understand → Easy to act on**

Use clear categories and strong information hierarchy.

---

# 18. Future Pages

The architecture should support additional community services.

Possible future sections:

- Events
- Scholarships
- Announcements
- Community Organizations
- Resources
- Contact / Help
- About Community

Do not create a new visual style for each feature.

All pages must inherit the same design system.

---

# 19. Responsive Design

Design mobile-first.

Breakpoints can be approximately:

```text
Mobile: < 640px
Tablet: 640–1024px
Desktop: > 1024px
Large desktop: > 1440px
```

### Mobile rules

- No horizontal scrolling
- Large enough tap targets
- Simplified navigation
- Stack multi-column sections
- Maintain generous spacing
- Do not simply shrink desktop UI

Every component should have an intentional mobile layout.

---

# 20. Accessibility

Minimum requirements:

- Sufficient color contrast
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Alt text for meaningful images
- Buttons should be actual `<button>` elements
- Links should be actual `<a>` elements
- Form fields must have labels
- Do not communicate meaning through color alone

---

# 21. Motion & Animation

Animation should be subtle and functional.

Allowed:

- Fade
- Small slide
- Hover transitions
- Menu transitions
- Card interaction
- Page transitions where useful

Recommended duration:

```text
150–300ms
```

Avoid:

- Excessive parallax
- Constant moving elements
- Large entrance animations
- Animations that delay content
- Decorative motion everywhere

The website should feel calm and reliable.

---

# 22. Forms & Search

Forms should prioritize usability.

Inputs should have:

- Clear labels
- Clear borders
- Adequate height
- Visible focus state
- Helpful placeholder text where appropriate
- Clear validation messages

Search should be prominent where the feature depends on discovery.

Especially for:

**K Connect**

---

# 23. Footer

Footer should contain:

- Community logo/name
- Short description
- Navigation
- Important links
- Contact information where applicable
- Copyright / organizational information

Keep it structured rather than visually overloaded.

---

# 24. UI Consistency Rules

Every contributor must follow these rules:

### DO

- Reuse components.
- Reuse spacing.
- Reuse typography.
- Reuse colors.
- Reuse button styles.
- Reuse card styles.
- Keep layouts predictable.
- Test desktop and mobile.
- Check existing components before creating new ones.

### DON'T

- Create random colors.
- Create random button styles.
- Create random border radii.
- Introduce a second visual language.
- Use excessive gradients.
- Add unnecessary animations.
- Copy generic SaaS dashboard patterns.
- Create one-off components when an existing component works.

---

# 25. Component Architecture

Recommended shared components:

```text
/components
  Navbar
  Footer
  Button
  Card
  Section
  Container
  SearchBar
  CategoryCard
  ProfileCard
  AnnouncementCard
  GuideCard
  Badge
  Modal
  Input
  Select
```

Components should be reusable and page-agnostic wherever possible.

---

# 26. Agent / AI Development Rules

Any AI coding/design agent working on this project must follow this file.

Before changing UI:

1. Inspect the existing component structure.
2. Reuse existing components.
3. Follow the color system.
4. Follow typography rules.
5. Follow spacing rules.
6. Preserve responsive behavior.
7. Do not introduce a new design philosophy.
8. Do not add dependencies unless necessary.
9. Do not redesign unrelated pages.
10. Keep changes scoped to the requested feature.

### Critical rule

**Do not invent a new UI style when implementing a feature. Extend the existing design system.**

---

# 27. Git Collaboration Rules

Because multiple people will work simultaneously:

### Branch naming

```text
main
develop
feature/<feature-name>
fix/<issue-name>
ui/<page-or-component>
```

Examples:

```text
feature/k-connect
feature/k-guide
ui/homepage
ui/navbar
fix/mobile-navbar
```

### Before starting work

```bash
git pull origin main
```

Then create/update your branch.

### Commit format

Use:

```text
feat: add K Connect directory
feat: add K Guide page
ui: redesign homepage hero
fix: mobile navbar overflow
refactor: extract reusable card
```

### Pull request rule

Before merging:

- Check desktop
- Check mobile
- Check existing pages
- Check console errors
- Check broken links
- Check visual consistency

---

# 28. Design Review Checklist

Before considering a page complete:

### Brand

- [ ] Uses `#098231`
- [ ] Uses `#E1DFDA`
- [ ] No arbitrary brand colors
- [ ] Logo placement is consistent

### Layout

- [ ] Consistent max-width
- [ ] Consistent spacing
- [ ] Strong visual hierarchy
- [ ] No unnecessary clutter

### Components

- [ ] Reuses existing components
- [ ] Buttons are consistent
- [ ] Cards are consistent
- [ ] Icons are consistent

### UX

- [ ] User understands the page purpose quickly
- [ ] Primary action is obvious
- [ ] Navigation is clear
- [ ] Search/filter works where required

### Responsive

- [ ] Mobile layout tested
- [ ] Tablet layout tested
- [ ] Desktop layout tested
- [ ] No horizontal overflow

### Accessibility

- [ ] Keyboard accessible
- [ ] Focus states exist
- [ ] Images have appropriate alt text
- [ ] Text contrast is readable

---

# 29. Design Principle

The single most important principle:

> **Make the community's information and services easy to discover, understand, and use.**

Visual design should support this goal.

The website should feel like a **well-designed digital community platform**, not a flashy promotional website.

---

# 30. Future Design System Extensions

As the project grows, document new reusable decisions here:

- New component patterns
- New content types
- New status colors
- New spacing requirements
- New responsive patterns
- New accessibility rules

Do not silently introduce major design changes in individual pages.

