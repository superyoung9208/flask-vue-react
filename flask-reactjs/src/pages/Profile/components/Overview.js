import React from 'react'
import moment from 'moment'

const Overview = ({ user }) => {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-sm-between g-mb-5">
        {user?.name ?
          (
            <h2 className="g-font-weight-300 g-mr-10">
              {user.name}
            </h2>
          )
          :
          (
            <h2 className="g-font-weight-300 g-mr-10">
              {user.username}
            </h2>
          )
        }
      </div>
      {
        user.member_since && (
          <h4 className="h6 g-font-weight-300 g-mb-10">
            <i className="icon-badge g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i>
            Member since : {moment(user.member_since).format('LLL')}
          </h4>
        )
      }
      {
        user.last_seen && (
          <h4 className="h6 g-font-weight-300 g-mb-10">
            <i className="icon-eye g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i>
            Last seen : {moment(user.last_seen).fromNow()}
          </h4>
        )
      }
      <ul className="list-inline g-font-weight-300">
        <li className="list-inline-item g-mr-20">
          <i className="icon-check g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i> Verified User
        </li>
        <li v-if="user.email" className="list-inline-item g-mr-20">
          <i className="icon-link g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i>
          <a
            className="g-color-main g-color-primary--hover"
            href={`mailto: ${user.email}`}
          >{user.email}</a>
        </li>
      </ul>
      {user.location && (
        <h4 className="h6 g-font-weight-300 g-mb-10">
          <i className="icon-location-pin g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i>
          {user.location}
        </h4>
      )}
      {user.about_me && (
        <div>
          <div
            className="u-divider u-divider-db-dashed u-divider-center g-brd-gray-light-v2 g-mt-50 g-mb-30"
          >
            <i
              className="u-divider__icon u-divider__icon--indented g-bg-gray-light-v4 g-color-gray-light-v1 rounded-circle"
            >Me</i>
          </div>
          <p className="g-line-height-1_8 g-font-weight-300">{user.about_me}</p>
        </div>
      )}
    </div>
  )
}

export default Overview