/**
 * FoodSuggestionsCard component for displaying food suggestions
 */

class FoodSuggestionsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: props.suggestions || []
    };
  }
  
  render() {
    const { suggestions } = this.state;
    
    return (
      <div className="card h-100 shadow">
        <div className="card-header bg-warning">
          <h3 className="mb-0"><i className="fas fa-lightbulb me-2"></i>Food Suggestions</h3>
        </div>
        <div className="card-body">
          {suggestions && suggestions.length > 0 ? (
            <div className="table-responsive mb-3">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Meal Type</th>
                    <th>Feasibility</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.slice(0, 5).map(suggestion => (
                    <tr key={suggestion.id}>
                      <td>{suggestion.food_item}</td>
                      <td>{suggestion.meal_type.name}</td>
                      <td>{suggestion.feasibility_score}/5</td>
                      <td>
                        {suggestion.approved ? (
                          <span className="badge bg-success">Approved</span>
                        ) : (
                          <span className="badge bg-secondary">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i> You haven't made any food suggestions yet.
            </div>
          )}
          <div className="d-grid">
            <a href="/food_suggestion" className="btn btn-warning">Suggest Food Item</a>
          </div>
        </div>
      </div>
    );
  }
}