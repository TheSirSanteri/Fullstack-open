import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (!message) return null

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: '#eee',
    fontSize: 20,
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={style}>{message}</div>
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
}

export default Notification