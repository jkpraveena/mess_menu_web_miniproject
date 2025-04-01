/**
 * MessPreferenceCard - React component for displaying and updating mess preferences
 */
class MessPreferenceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messName: '',
      messTypeId: '',
      isLoading: false,
      message: null,
      messageType: 'info' // 'info', 'success', 'danger'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true, message: null });

    try {
      const response = await fetch('/update_mess_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCsrfToken()
        },
        body: JSON.stringify({
          mess_name: this.state.messName,
          mess_type: this.state.messTypeId
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        this.setState({ 
          message: 'Mess preference updated successfully!', 
          messageType: 'success',
          messName: '',
          messTypeId: '' 
        });
        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        this.setState({ 
          message: result.error || 'Failed to update mess preference', 
          messageType: 'danger' 
        });
      }
    } catch (error) {
      this.setState({ 
        message: 'An error occurred while updating mess preference', 
        messageType: 'danger' 
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  getCsrfToken() {
    // Extract CSRF token from meta tag
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }

  render() {
    const { messPreference, messTypes } = this.props;
    const { isLoading, message, messageType } = this.state;
    
    return (
      <div className="card h-100 shadow">
        <div className="card-header bg-success">
          <h3 className="mb-0"><i className="fas fa-utensils me-2"></i>Mess Preference</h3>
        </div>
        <div className="card-body">
          {messPreference && (
            <div className="mb-4">
              <h4>Current Preference</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-store me-2"></i>Mess Name:</span>
                  <span className="badge bg-success rounded-pill">{messPreference.mess_name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-hamburger me-2"></i>Mess Type:</span>
                  <span className="badge bg-success rounded-pill">{messPreference.mess_type.name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-calendar-alt me-2"></i>Last Updated:</span>
                  <span className="badge bg-success rounded-pill">
                    {new Date(messPreference.created_at).toLocaleDateString()}
                  </span>
                </li>
              </ul>
            </div>
          )}

          <h4>Update Preference</h4>
          
          {message && (
            <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
              {message}
              <button type="button" className="btn-close" onClick={() => this.setState({ message: null })}></button>
            </div>
          )}
          
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="messName" className="form-label">Mess Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="messName" 
                name="messName" 
                value={this.state.messName}
                onChange={this.handleInputChange}
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="messTypeId" className="form-label">Mess Type</label>
              <select 
                className="form-select" 
                id="messTypeId" 
                name="messTypeId"
                value={this.state.messTypeId}
                onChange={this.handleInputChange}
                required
              >
                <option value="" disabled>Select Mess Type</option>
                {messTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </span>
                ) : 'Update Preference'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}