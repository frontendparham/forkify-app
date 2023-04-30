import View from './View';
import icons from 'url:../../img/new-icons.svg';

class SortResultsView extends View {
  _parentEl = document.querySelector('.sort');
  _errorMessage = 'Somthing went wrong';
  _message = '';

  _sortOptions = document.querySelectorAll('.sort__item');

  addHandlerSortResults(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const sortOption = e.target.closest('.sort__item');
      if (!sortOption) return;

      sortOption.classList.toggle('sort__item-active');

      const sortBy = sortOption.dataset.sortBy;
      handler(sortBy);
    });
  }

  _generateMarkup() {}
}

export default new SortResultsView();
