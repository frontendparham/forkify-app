import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _handler = null; // initialize handler as null

  constructor() {
    super();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  toggleWindowEscape(el) {
    if (el.key === 'Escape') {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    }
  }

  _submitForm(e) {
    e.preventDefault();
    const dataArr = [...new FormData(this._parentEl)];
    const data = Object.fromEntries(dataArr);
    if (this.validateAddRecipeForm(data)) {
      if (this._handler) {
        // check if handler is defined
        this._handler(data); // call the handler function
      }
    }
  }

  _addHandlerOpenWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    window.addEventListener('keydown', this.toggleWindowEscape.bind(this));
  }

  addHandlerUpload(handler) {
    this._handler = handler; // store the handler function
    this._parentEl.addEventListener('submit', this._submitForm.bind(this));
  }

  _generateMarkup() {}

  ////////////////////////////////////////
  // Start of Form validation
  ////////////////////////////////////////
  // Function to set error message for an input element
  _setError(element, message) {
    const inputGroup = document.getElementById(`${element}`).parentElement;
    const errorDisplay = inputGroup.querySelector('.form-input-error');

    errorDisplay.textContent = message;
    inputGroup.classList.add('form-error');
    inputGroup.classList.remove('form-success');
  }

  // Function to set success message for an input element
  _setSuccess(element) {
    const inputGroup = document.getElementById(`${element}`).parentElement;
    const errorDisplay = inputGroup.querySelector('.form-input-error');

    errorDisplay.textContent = '';
    inputGroup.classList.add('form-success');
    inputGroup.classList.remove('form-error');
  }

  validateAddRecipeForm(newRecipe) {
    let hasError = false; // flag variable

    const titleValue = newRecipe.title.trim();
    const publisherValue = newRecipe.publisher.trim();
    const sourceUrlValue = newRecipe.sourceUrl.trim();
    const servingsValue = +newRecipe.servings;
    const cookingTimeValue = +newRecipe.cookingTime;
    const imageValue = newRecipe.image.trim();

    const ingredients = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );

    if (ingredients.length === 0) {
      this._setError('ingredient-1', 'You should have at least 1 ingredient');
      hasError = true;
    }

    const ingredientObjects = {};

    ingredients.forEach(ingredient => {
      const [name, value] = ingredient;
      const trimmedValues = value.split(',').map(v => v.trim());
      const joinedValues = trimmedValues.join(',');
      ingredientObjects[name] = joinedValues;
    });

    const ingredientRegex = /^\d+,\w+,\w+$/;

    for (const key in ingredientObjects) {
      if (!ingredientRegex.test(ingredientObjects[key])) {
        this._setError(
          `${key}`,
          'Wrong ingredient format! Please use the correct format'
        );
        hasError = true;
      } else this._setSuccess(`${key}`);
    }

    if (titleValue === '') {
      this._setError('title', 'Title is required');
      hasError = true;
    } else {
      this._setSuccess('title');
    }

    if (publisherValue === '') {
      this._setError('publisher', 'Publisher is required');
      hasError = true;
    } else {
      this._setSuccess('publisher');
    }

    if (sourceUrlValue === '') {
      this._setError('sourceUrl', 'Source URL is required');
      hasError = true;
    } else {
      this._setSuccess('sourceUrl');
    }

    if (servingsValue === 0) {
      this._setError('servings', 'Servings is required');
      hasError = true;
    } else {
      this._setSuccess('servings');
    }

    if (cookingTimeValue === 0) {
      this._setError('cookingTime', 'CookingTime is required');
      hasError = true;
    } else {
      this._setSuccess('cookingTime');
    }

    if (imageValue === '') {
      this._setError('image', 'Image URL is required');
      hasError = true;
    } else {
      this._setSuccess('image');
    }

    return !hasError;
  }
  ////////////////////////////////////////
  // End of Form validation
  ////////////////////////////////////////
}

export default new AddRecipeView();
