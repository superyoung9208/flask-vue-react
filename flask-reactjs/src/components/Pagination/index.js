import React from 'react'
import PropTypes from 'prop-types'

export default class Pagination extends React.Component {
  state = {
    perPage: 3,
    leftPages: 2,
    rightPages: 2,
  }
  iter_pages() {
    let { curPage, totalPages } = this.props
    let leftPages = this.props.leftPages ? this.props.leftPages : this.state.leftPages
    let rightPages = this.props.rightPages ? this.props.rightPages : this.state.rightPages
    // 构建分页导航，当前页左、右两边各显示2页，比如  1, 2, ... 7, 8, 9, 10, 11 ... 30, 31
    let arr = [1, 2]
    for (var i = leftPages; i > 0; i--) {
      arr.push(curPage - i)
    }
    arr.push(curPage)
    for (let i = 1; i <= rightPages; i++) {
      arr.push(curPage + i)
    }
    arr.push(totalPages - 1)
    arr.push(totalPages)

    // 小于1，或大于最大页数的都是非法的，要去除
    arr = arr.filter(item => item > 0 && item <= totalPages)
    // 去除重复项
    arr = [...new Set(arr)]
    // 假设当前页为1，总页数为6或6以上时，在倒数第2个位置插入特殊标记  1, 2, 3 ... 5, 6
    if (curPage + rightPages < totalPages - 2) {
      arr.splice(-2, 0, 'NaN')
    }
    // 当前页为6或6以上时，在第3个位置插入特殊标记  1, 2 ... 4, 5, 6
    if (curPage - leftPages - 1 > 2) {
      arr.splice(2, 0, 'NaN')
    }
    return arr
  }
  renderPaginate() {
    let { curPage, go, perPage } = this.props
    return this.iter_pages().map((page, index) => {
      if (page !== 'NaN') {
        return <li key={index} className="list-inline-item g-hidden-sm-down">
          <div
            onClick={() => go(page, perPage)}
            className={['u-pagination-v1__item', 'u-pagination-v1-1', 'g-rounded-50', 'g-pa-12-21', curPage === page ? 'u-pagination-v1-1--active' : ""].join(" ")}
          >{page}</div>
        </li>
      } else {
        return <li className="list-inline-item g-hidden-sm-down" key={index}>
          <span className="g-pa-12-19">...</span>
        </li>
      }
    })
  }

  render() {
    const { curPage, totalPages, go } = this.props
    const perPage = this.props.perPage ? this.props.perPage : this.state.perPage
    return (
      <nav aria-label="Page Navigation" className="g-mb-50">
        <ul className="list-inline">
          <li className="list-inline-item">
            <div
              onClick={() => go(curPage - 1, perPage)}
              className={['u-pagination-v1__item', 'u-pagination-v1-1', 'g-rounded-50', 'g-pa-12-21', curPage === 1 ? 'u-pagination-v1__item--disabled' : ""].join(" ")}
              aria-label="Previous"
            >
              <span aria-hidden="true">
                <i className="fa fa-angle-left"></i>
              </span>
              <span className="sr-only">Previous</span>
            </div>
          </li>
          {this.renderPaginate()}
          <li className="list-inline-item">
            <div
              onClick={() => go(curPage + 1, perPage)}
              className={['u-pagination-v1__item', 'u-pagination-v1-1', 'g-rounded-50', 'g-pa-12-21', curPage === totalPages || totalPages === 0 ? 'u-pagination-v1__item--disabled' : ""].join(" ")}
              aria-label="Next"
            >
              <span aria-hidden="true">
                <i className="fa fa-angle-right"></i>
              </span>
              <span className="sr-only">Next</span>
            </div>
          </li>
          <li className="list-inline-item float-right">
            <span className="u-pagination-v1__item-info g-pa-12-19">Page {curPage} of {totalPages}</span>
          </li>
        </ul>
      </nav>
    )
  }
}

Pagination.propTypes = {
  curPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
}