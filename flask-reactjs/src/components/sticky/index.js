import React, {createRef} from 'react'
import styles from './index.module.css'

class Sticky extends React.Component{
  placeHolder = createRef()
  content = createRef()

  handleScroll = () => {
    const { top } = this.placeHolder.current.getBoundingClientRect()
    if (top < 10) {
      this.content.current.classList.add(styles.fixed)
    } else {
      this.content.current.classList.remove(styles.fixed)
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return <div>
      <div ref={this.placeHolder}></div>
      <div ref={this.content}>{this.props.children}</div>
    </div>
  }
}

export default Sticky
