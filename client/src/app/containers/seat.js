import {connect} from 'react-redux'
import Seat from '../components/map/Seat'
import {ACTIVE_USER_SWAP} from '../actions/users'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
	storeActiveUsers: payload => dispatch({type: ACTIVE_USER_SWAP, payload})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Seat);
