
class SearchProductIds {
  setquery(query){
    localStorage.setItem('query', query)
  }
  getquery(){
    return localStorage.getItem('query') ? localStorage.getItem('query') : "";
  }
}

export default new SearchProductIds();