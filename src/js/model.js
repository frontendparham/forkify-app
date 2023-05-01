import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  shoppingList: [],
};

const createResipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createResipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    if (state.shoppingList.some(shoppingItem => shoppingItem.id === id))
      state.recipe.isInShoppingList = true;
    else state.recipe.isInShoppingList = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // Reset page to 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const persistShoppingList = function () {
  localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
};

export const addToShoppingList = function (recipe) {
  // Add to shopping list
  state.shoppingList.push(recipe);

  // Mark current recipe as is in hopping list
  if (recipe.id === state.recipe.id) state.recipe.isInShoppingList = true;

  persistShoppingList();
};

export const deleteFromShoppingList = function (id) {
  // Delete from shopping list
  const index = state.shoppingList.findIndex(el => el.id === id);
  state.shoppingList.splice(index, 1);

  // Mark current recipe as NOT in shopping list
  if (id === state.recipe.id) state.recipe.isInShoppingList = false;

  persistShoppingList();
};

const init = function () {
  // Get bookmarks back from local storage
  const bookmarkStorage = localStorage.getItem('bookmarks');
  if (bookmarkStorage) state.bookmarks = JSON.parse(bookmarkStorage);

  // Get shopping list back from local storage
  const shoppingListStorage = localStorage.getItem('shoppingList');
  if (shoppingListStorage) state.shoppingList = JSON.parse(shoppingListStorage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        // if (ingArr.length !== 3)
        //   throw new Error(
        //     'Wrong ingredient format! Please use the correct format'
        //   );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createResipeObject(data);
    addBookmark(state.recipe);
    addToShoppingList(state.recipe);
  } catch (err) {
    throw err;
  }
};

// The search results doesn't have Ingredienrs or Suration time so we should wait
export const sortResultsByIngredients = function () {};

export const sortResultsByDuration = function () {};
