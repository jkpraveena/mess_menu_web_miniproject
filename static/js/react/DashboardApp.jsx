/**
 * DashboardApp - Main React application for the Student Dashboard
 */
class DashboardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      messPreference: null,
      messTypes: [],
      suggestions: [],
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  async fetchDashboardData() {
    try {
      // Fetch dashboard data from a new API endpoint we'll create
      const response = await fetch('/api/dashboard_data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.setState({
        student: data.student,
        messPreference: data.mess_preference,
        messTypes: data.mess_types,
        suggestions: data.suggestions,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      this.setState({
        error: 'Failed to load dashboard data. Please refresh the page.',
        isLoading: false
      });
    }
  }

  render() {
    const { student, messPreference, messTypes, suggestions, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      );
    }

    if (!student) {
      return (
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          Student information not found. Please complete your profile.
        </div>
      );
    }

    return (
      <div>
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <i className="fas fa-user-circle fa-3x me-3"></i>
                  <div>
                    <h2 className="mb-0">Welcome, {student.name}</h2>
                    <p className="mb-0">Registration Number: {student.reg_no}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <StudentInfoCard student={student} />
          </div>
          
          <div className="col-md-4 mb-4">
            <MessPreferenceCard 
              messPreference={messPreference} 
              messTypes={messTypes} 
            />
          </div>
          
          <div className="col-md-4 mb-4">
            <FoodSuggestionsCard suggestions={suggestions} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <QuickLinksCard />
          </div>
        </div>
      </div>
    );
  }
}