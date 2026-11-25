export const RECIPES = [
  {
    id: 'ember-pasta', name: 'Ember Tomato Pasta', short: 'Ember Pasta', day: 1, price: 42, color: '#cf6548',
    hint: 'ribbons in a red sauce',
    components: [
      { ingredient: 'pasta', station: 'boil', time: 8 },
      { ingredient: 'tomato', station: 'chop', time: 3 },
      { ingredient: 'cheese', station: 'pantry', time: 0 },
    ],
  },
  {
    id: 'oak-salmon', name: 'Oak-Grilled Salmon', short: 'Oak Salmon', day: 1, price: 48, color: '#dc855f',
    hint: 'a golden salmon fillet',
    components: [
      { ingredient: 'salmon', station: 'grill', time: 6 },
      { ingredient: 'lemon', station: 'chop', time: 3 },
      { ingredient: 'herbs', station: 'pantry', time: 0 },
    ],
  },
  {
    id: 'smoky-burger', name: 'Smoky Stack Burger', short: 'Smoky Burger', day: 1, price: 46, color: '#b66b3e',
    hint: 'layers on a toasted bun',
    components: [
      { ingredient: 'patty', station: 'grill', time: 6 },
      { ingredient: 'lettuce', station: 'chop', time: 3 },
      { ingredient: 'tomato', station: 'chop', time: 3 },
      { ingredient: 'bun', station: 'pantry', time: 0 },
    ],
  },
  {
    id: 'berry-tart', name: 'Wild Berry Tart', short: 'Wild Berry Tart', day: 2, price: 40, color: '#a15c78',
    hint: 'berries tucked in pastry',
    components: [
      { ingredient: 'pastry', station: 'pantry', time: 0 },
      { ingredient: 'berries', station: 'pantry', time: 0 },
      { ingredient: 'cream', station: 'pantry', time: 0 },
    ],
  },
  {
    id: 'fish-chips', name: 'Golden Fish & Chips', short: 'Fish & Chips', day: 2, price: 44, color: '#d59b43',
    hint: 'crisp fish with chips',
    components: [
      { ingredient: 'fish', station: 'fry', time: 7 },
      { ingredient: 'chips', station: 'fry', time: 7 },
      { ingredient: 'lemon', station: 'chop', time: 3 },
    ],
  },
  {
    id: 'mushroom-risotto', name: 'Forest Mushroom Risotto', short: 'Forest Risotto', day: 3, price: 50, color: '#9a7958',
    hint: 'creamy rice and mushrooms',
    components: [
      { ingredient: 'rice', station: 'boil', time: 8 },
      { ingredient: 'mushroom', station: 'chop', time: 3 },
      { ingredient: 'cream', station: 'pantry', time: 0 },
    ],
  },
];

export function recipesForDay(day) {
  return RECIPES.filter((recipe) => recipe.day <= day);
}

export function componentFor(ingredient) {
  for (const recipe of RECIPES) {
    const component = recipe.components.find((part) => part.ingredient === ingredient);
    if (component) return component;
  }
  return null;
}

export function recipeForItems(items, day) {
  if (!items.length) return null;
  const keys = items.map((item) => item.ingredient).sort().join('|');
  return recipesForDay(day).find((recipe) => recipe.components.map((part) => part.ingredient).sort().join('|') === keys) ?? null;
}
