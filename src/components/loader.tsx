import { Component, type ReactNode } from 'react';

class Loader extends Component {
  render(): ReactNode {
    return (
      <div className="loader">
        <span>Loading...</span>
      </div>
    );
  }
}

export default Loader;
