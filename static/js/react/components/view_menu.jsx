/**
 * ViewMenu - React component for viewing and selecting menu items
 */
class ViewMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        breakfast: null,
        lunch: null,
        snacks: null,
      },
    };
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  handleSelect = (mealType, itemId) => {
    this.setState(prev => ({
      selected: {
        ...prev.selected,
        [mealType]: itemId
      }
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted:\n" + JSON.stringify(this.state.selected, null, 2));
  };

  renderMealSection(mealType, items) {
    const selectedId = this.state.selected[mealType];
    return (
      <div className="mb-4" key={mealType}>
        <h4 className="text-capitalize">{mealType}</h4>
        <div className="row">
          {items.map(item => (
            <div className="col-md-3 mb-3" key={item.id}>
              <div
                className={`card h-100 ${selectedId === item.id ? 'border-warning border-3' : ''}`}
                onClick={() => this.handleSelect(mealType, item.id)}
                style={{ cursor: 'pointer' }}
              >
                <img src={item.img} className="card-img-top" alt={item.name} style={{ height: '150px', objectFit: 'cover' }} />
                <div className="card-body text-center">
                  <h5 className="card-title mb-0">{item.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { meals } = this.props;

    return (
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0"><i className="fas fa-utensils me-2"></i>View Menu</h3>
          </div>
          <div className="card-body">
            <form onSubmit={this.handleSubmit}>
              {Object.keys(meals).map(mealType => this.renderMealSection(mealType, meals[mealType]))}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Submit Menu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}