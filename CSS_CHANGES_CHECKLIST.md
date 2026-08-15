# 🎨 CSS CHANGES CHECKLIST - LINE-BY-LINE GUIDE

## What to Change in Your Current CSS

**Current File:** `frontend/src/App.css`

---

## STEP 1: Add Design System Variables (Add at TOP)

### Add This Before All Other Rules:
```css
:root {
  /* COLOR PALETTE */
  --color-primary: #2c3e50;
  --color-primary-light: #34495e;
  --color-primary-dark: #1a252f;
  --color-risk-high: #e74c3c;
  --color-risk-medium: #f39c12;
  --color-risk-low: #27ae60;
  --color-bg-light: #f4f6f8;
  --color-bg-card: #ffffff;
  --color-text-primary: #2c3e50;
  --color-text-secondary: #7f8c8d;
  --color-border: #d0d8e0;

  /* SPACING (8px base) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* TYPOGRAPHY */
  --font-family: 'Segoe UI', Arial, sans-serif;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 36px;

  /* SHADOWS */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* BORDER RADIUS */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* TRANSITIONS */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-light: #0f1419;
    --color-bg-card: #1a1f2e;
    --color-text-primary: #e8eef5;
    --color-text-secondary: #a0a8b0;
    --color-border: #2d3748;
  }
}
```

---

## STEP 2: Update Body & Global Styles

### CHANGE THIS (Current):
```css
body {
  margin: 0;
  background-color: #f4f6f8;
  font-family: 'Segoe UI', Arial, sans-serif;
}
```

### TO THIS:
```css
body {
  margin: 0;
  background-color: var(--color-bg-light);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  line-height: 1.5;
}
```

---

## STEP 3: Update Dashboard

### CHANGE THIS (Current):
```css
.dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px;
}
```

### TO THIS:
```css
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg);
}

@media (min-width: 641px) {
  .dashboard {
    padding: var(--space-xl);
  }
}

@media (min-width: 1025px) {
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-xl);
  }
}
```

---

## STEP 4: Update Heading

### CHANGE THIS (Current):
```css
h1 {
  color: #2c3e50;
  margin-bottom: 24px;
}
```

### TO THIS:
```css
h1 {
  color: var(--color-text-primary);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-top: 0;
  margin-bottom: var(--space-lg);
  letter-spacing: -0.5px;
}
```

---

## STEP 5: Update Summary Cards

### CHANGE THIS (Current):
```css
.summary-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
}
```

### TO THIS:
```css
.summary-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

@media (min-width: 641px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .summary-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## STEP 6: Update Card Component

### CHANGE THIS (Current):
```css
.card {
  flex: 1;
  background: white;
  border-left: 6px solid;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

### TO THIS:
```css
.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  transition: width var(--transition-base);
}

.card:nth-child(1)::before {
  background: var(--color-risk-high);
}

.card:nth-child(2)::before {
  background: var(--color-risk-medium);
}

.card:nth-child(3)::before {
  background: var(--color-risk-low);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card:hover::before {
  width: 8px;
}
```

---

## STEP 7: Update Card Text

### CHANGE THIS (Current):
```css
.card .count {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
}

.card .label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 6px;
}
```

### TO THIS:
```css
.card .count {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.card .label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}
```

---

## STEP 8: Update Table Styles

### CHANGE THIS (Current):
```css
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #2c3e50;
  color: white;
}

th, td {
  text-align: left;
  padding: 12px 16px;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
}
```

### TO THIS:
```css
table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

thead {
  background-color: var(--color-primary);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  text-align: left;
  padding: var(--space-md);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary-dark);
}

td {
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  font-size: var(--font-size-sm);
}

tbody tr {
  transition: background-color var(--transition-fast);
}

tbody tr:nth-child(even) {
  background-color: rgba(244, 246, 248, 0.5);
}

tbody tr:hover {
  background-color: var(--color-bg-light);
  cursor: pointer;
}

tbody tr:focus-within {
  box-shadow: inset 0 0 0 2px var(--color-primary);
}
```

---

## STEP 9: Update Risk Badge

### CHANGE THIS (Current):
```css
.risk-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}
```

### TO THIS:
```css
.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
  transition: all var(--transition-fast);
}

.risk-badge::before {
  content: '● ';
  font-size: var(--font-size-lg);
}

/* For HTML: <span class="risk-badge" data-risk="High">High Risk</span> */
.risk-badge[data-risk="High"] {
  background: var(--color-risk-high);
}

.risk-badge[data-risk="Medium"] {
  background: var(--color-risk-medium);
  color: #000;
}

.risk-badge[data-risk="Low"] {
  background: var(--color-risk-low);
}

.risk-badge.large {
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-base);
}

.risk-badge:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}
```

---

## STEP 10: Update Status Message

### CHANGE THIS (Current):
```css
.status-message {
  text-align: center;
  margin-top: 100px;
  font-size: 18px;
  color: #555;
}

.status-message.error {
  color: #e74c3c;
}
```

### TO THIS:
```css
.status-message {
  text-align: center;
  margin-top: 100px;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  animation: slideIn var(--transition-base) ease-out;
}

.status-message.error {
  color: white;
  background-color: var(--color-risk-high);
  border-left: 4px solid var(--color-risk-high);
}

.status-message.loading {
  color: var(--color-primary);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## STEP 11: Update Modal Overlay & Modal

### CHANGE THIS (Current):
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 28px;
  max-width: 450px;
  width: 90%;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

### TO THIS:
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn var(--transition-base) ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: var(--shadow-lg);
  animation: slideUp var(--transition-base) ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

@media (min-width: 641px) {
  .modal {
    padding: var(--space-xl);
    width: 85%;
    max-width: 500px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## STEP 12: Update Close Button

### CHANGE THIS (Current):
```css
.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}
```

### TO THIS:
```css
.close-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: none;
  border: 2px solid transparent;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-secondary);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background-color: var(--color-bg-light);
  color: var(--color-text-primary);
}

.close-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## STEP 13: Update Modal Heading

### CHANGE THIS (Current):
```css
.modal h2 {
  margin-top: 0;
  color: #2c3e50;
}
```

### TO THIS:
```css
.modal h2 {
  margin-top: 0;
  margin-bottom: var(--space-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: 600;
}
```

---

## STEP 14: Update Detail Grid & Info Box

### CHANGE THIS (Current):
```css
.risk-badge.large {
  display: inline-block;
  padding: 6px 16px;
  font-size: 14px;
  margin-bottom: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px 0;
  font-size: 14px;
}
```

### TO THIS:
```css
.risk-badge.large {
  display: inline-block;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-lg);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin: var(--space-lg) 0;
  font-size: var(--font-size-sm);
}

@media (min-width: 641px) {
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }
}

.detail-grid div {
  padding: var(--space-md);
  background-color: var(--color-bg-light);
  border-radius: var(--radius-md);
}

.detail-grid strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  font-weight: 600;
}
```

---

## STEP 15: Update Info & Disclaimer Boxes

### CHANGE THIS (Current):
```css
.why-box {
  background: #f4f6f8;
  padding: 14px;
  border-radius: 8px;
  margin-top: 16px;
}

.why-box p {
  margin: 8px 0 0;
  color: #555;
}

.disclaimer-small {
  font-size: 12px;
  color: #999;
  margin-top: 16px;
  font-style: italic;
}
```

### TO THIS:
```css
.why-box {
  background: var(--color-bg-light);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-top: var(--space-lg);
  border-left: 4px solid var(--color-primary);
}

.why-box strong {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  font-weight: 600;
}

.why-box p {
  margin: var(--space-sm) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.disclaimer-small {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-lg);
  font-style: italic;
  padding: var(--space-md);
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: var(--radius-md);
}
```

---

## STEP 16: Update Filter Buttons

### CHANGE THIS (Current):
```css
.filter-buttons {
  display: inline-flex;
  gap: 6px;
}

.filter-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #e0e0e0;
  cursor: pointer;
  font-weight: 600;
}

.filter-buttons button.active {
  background: #2c3e50;
  color: white;
}
```

### TO THIS:
```css
.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.filter-buttons button {
  padding: var(--space-sm) var(--space-md);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  background: var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  min-width: 80px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-buttons button:hover {
  background-color: var(--color-bg-main);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.filter-buttons button:active {
  transform: translateY(0);
}

.filter-buttons button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.filter-buttons button.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.filter-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## STEP 17: Update Controls Section

### CHANGE THIS (Current):
```css
.controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.controls input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 200px;
}
```

### TO THIS:
```css
.controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

@media (min-width: 641px) {
  .controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-lg);
  }
}

.controls input {
  padding: var(--space-sm) var(--space-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: inherit;
  transition: all var(--transition-fast);
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
  min-width: auto;
  width: 100%;
}

@media (min-width: 641px) {
  .controls input {
    width: auto;
    min-width: 250px;
  }
}

.controls input::placeholder {
  color: var(--color-text-secondary);
}

.controls input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
}
```

---

## SUMMARY OF CHANGES

| Component | Changes |
|-----------|---------|
| **Variables** | Added CSS variables for colors, spacing, etc |
| **Body** | Uses CSS variables |
| **Dashboard** | Added responsive media queries |
| **Heading** | Uses variables for size and color |
| **Cards** | Added hover effects, animations, better spacing |
| **Table** | Sticky headers, better colors, responsive |
| **Badges** | Enhanced styling with icons, better contrast |
| **Buttons** | Improved focus states, hover effects |
| **Modal** | Added animations, better sizing on mobile |
| **Input** | Better focus states, responsive width |
| **Overall** | Responsive design, animations, accessibility |

---

## TESTING CHECKLIST

After making these changes, test:

- [ ] Visual looks good on desktop (1024px+)
- [ ] Visual looks good on tablet (641px-1023px)
- [ ] Visual looks good on mobile (320px-640px)
- [ ] Buttons have hover effects
- [ ] Buttons have focus-visible outlines
- [ ] Modal closes properly
- [ ] Colors are readable
- [ ] No horizontal scrolling on mobile
- [ ] Images resize properly
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Test with dark mode toggle
- [ ] Test with screen reader

---

## BEFORE & AFTER COMPARISON

### BEFORE
```css
.card {
  flex: 1;
  background: white;
  border-left: 6px solid;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
```

### AFTER
```css
.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: currentColor;
  transition: width var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card:hover::before {
  width: 8px;
}
```

**Improvements:**
- ✅ Uses CSS variables (themable)
- ✅ Better responsive design
- ✅ Hover animation feedback
- ✅ Accessible focus states
- ✅ Professional appearance

---

## FILES TO CREATE (Optional)

For better organization, split CSS into multiple files:

**frontend/src/styles/variables.css**
- All CSS variables only

**frontend/src/styles/base.css**
- Body, html, reset styles

**frontend/src/styles/components.css**
- Card, button, badge styles

**frontend/src/styles/responsive.css**
- All media queries

Then in App.jsx:
```jsx
import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'
import './styles/responsive.css'
```

---

## QUICK IMPLEMENTATION ORDER

1. **First:** Add CSS variables at top
2. **Second:** Update colors to use variables
3. **Third:** Add spacing variables usage
4. **Fourth:** Add responsive media queries
5. **Fifth:** Add animations and transitions
6. **Sixth:** Add hover effects
7. **Seventh:** Add focus states
8. **Eighth:** Test on all devices

---

**Total Estimated Time:** 4-6 hours
**Impact:** Looks professional, mobile-friendly, accessible

**Ready to start? Copy the CSS code above and paste into your App.css file!**
