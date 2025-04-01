/**
 * QuickLinksCard - React component for displaying quick links section
 */
class QuickLinksCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="card shadow">
        <div className="card-header bg-info">
          <h3 className="mb-0"><i className="fas fa-link me-2"></i>Quick Links</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="d-grid">
                <a href="/view_menu" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-clipboard-list me-2"></i>View Menu
                </a>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-grid">
                <a href="/food_suggestion" className="btn btn-outline-success btn-lg">
                  <i className="fas fa-lightbulb me-2"></i>Suggest Food
                </a>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-grid">
                <a href="/report" className="btn btn-outline-warning btn-lg">
                  <i className="fas fa-file-export me-2"></i>Generate Reports
                </a>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-grid">
                <a href="#" className="btn btn-outline-danger btn-lg">
                  <i className="fas fa-question-circle me-2"></i>Help & Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}