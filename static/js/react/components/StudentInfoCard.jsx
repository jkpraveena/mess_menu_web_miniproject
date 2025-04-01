/**
 * StudentInfoCard - React component for displaying student information
 */
class StudentInfoCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { student } = this.props;
    
    return (
      <div className="card h-100 shadow">
        <div className="card-header bg-secondary">
          <h3 className="mb-0"><i className="fas fa-id-card me-2"></i>Student Information</h3>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span><i className="fas fa-user me-2"></i>Name:</span>
              <span className="badge bg-primary rounded-pill">{student.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span><i className="fas fa-id-badge me-2"></i>Registration No:</span>
              <span className="badge bg-primary rounded-pill">{student.reg_no}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span><i className="fas fa-building me-2"></i>Block:</span>
              <span className="badge bg-primary rounded-pill">{student.block}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span><i className="fas fa-door-open me-2"></i>Room Number:</span>
              <span className="badge bg-primary rounded-pill">{student.room_number}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}