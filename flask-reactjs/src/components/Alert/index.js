import React from 'react'
// import styles from './index.module.css'

class Alert extends React.Component {
    render() {
        return <div className={['alert','alert-'+this.props.variant].join(" ")} role="alert">
            {this.props.children}
        </div>
    }
}

export default Alert