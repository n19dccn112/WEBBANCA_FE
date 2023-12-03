import React, {Component} from 'react'

class PageSlide extends Component{
  handlePrevious(e) {
    if (this.props.numberIndex > 1)
      this.props.handleNumberIndex(this.props.numberIndex - 1)
  }
  handleNext(e) {
    if (this.props.numberIndex < this.props.numberPage)
      this.props.handleNumberIndex(this.props.numberIndex + 1)
  }
  render() {
    return (
          <nav className="d-flex justify-content-center mb-5 mt-3" aria-label="page navigation">
            <ul className="pagination">
              <li className="page-item"><button className="page-link" onClick={(e) => this.handlePrevious(e)} aria-label="Previous">
                <span aria-hidden="true">Trước</span></button></li>

              {this.props.pageComponent.map((value, index) => (
                  value
              ))}
              <li className="page-item"><button className="page-link" onClick={(e) => this.handleNext(e)} aria-label="Next">
                <span aria-hidden="true">Sau</span></button></li>
            </ul>
          </nav>
    )
  }
}
export default PageSlide;