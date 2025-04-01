/**
 * MessPreferenceCard component for displaying and updating mess preferences
 */

class MessPreferenceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messName: '',
      messTypeId: '',
      messTypes: props.messTypes || [],
      currentPreference: props.messPreference || null,
      isSubmitting: false,
      message: null
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
    this.setState({ isSubmitting: true, message: null });
    
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
      
      const data = await response.json();
      
      if (response.ok) {
        this.setState({ 
          message: { type: 'success', text: 'Preference updated successfully!' },
          currentPreference: data.preference
        });
        // Update parent component if needed
        if (this.props.onPreferenceUpdate) {
          this.props.onPreferenceUpdate(data.preference);
        }
      } else {
        this.setState({ message: { type: 'danger', text: data.error || 'Failed to update preference' } });
      }
    } catch (error) {
      this.setState({ message: { type: 'danger', text: 'An error occurred. Please try again.' } });
      console.error('Error:', error);
    } finally {
      this.setState({ isSubmitting: false });
    }
  }
  
  getCsrfToken() {
    // Get CSRF token from meta tag
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  }
  
  render() {
    const { messTypes, currentPreference, isSubmitting, message } = this.state;
    
    return (
      <div className="card h-100 shadow">
        <div className="card-header bg-success">
          <h3 className="mb-0"><i className="fas fa-utensils me-2"></i>Mess Preference</h3>
        </div>
        <div className="card-body">
          {currentPreference && (
            <div className="mb-4">
              <h4>Current Preference</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-store me-2"></i>Mess Name:</span>
                  <span className="badge bg-success rounded-pill">{currentPreference.mess_name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-hamburger me-2"></i>Mess Type:</span>
                  <span className="badge bg-success rounded-pill">{currentPreference.mess_type.name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><i className="fas fa-calendar-alt me-2"></i>Last Updated:</span>
                  <span className="badge bg-success rounded-pill">
                    {new Date(currentPreference.created_at).toLocaleDateString()}
                  </span>
                </li>
              </ul>
            </div>
          )}
          
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => this.setState({ message: null })}></button>
            </div>
          )}
          
          <h4>Update Preference</h4>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Preference'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}