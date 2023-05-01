import View from './View';
import previewView from './previewView';

class ShoppingListView extends View {
  _parentEl = document.querySelector('.shopping__list');
  _errorMessage = 'Shopping list is empty!';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(shoppingItem => previewView.render(shoppingItem, false))
      .join('');
  }
}

export default new ShoppingListView();
