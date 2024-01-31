
document.addEventListener('keypress', (event) => {
  var searchBarClass = document.getElementsByClassName("dfd-facet ");
  searchBarClass[0].classList.add("searchNotHidden");
  searchBarClass[0].setAttribute('style', 'visibility:initial !important');
  console.log(searchBarClass);
}, false);