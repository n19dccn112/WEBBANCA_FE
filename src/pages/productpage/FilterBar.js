import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minPriceFilter: 0,
      maxPriceFilter: 30000000,
    };
  }

  handleSliderChange = (values) => {
    this.setState({
      minPriceFilter: values[0],
      maxPriceFilter: values[1],
    });
    this.props.filterProductsByPrice(values[0], values[1]);
  }

  render() {
    return (
        <div>
          <Slider className="margin-bot-40px"
              range
              min={0}
              max={30000000}
              value={[this.state.minPriceFilter, this.state.maxPriceFilter]}
              onChange={this.handleSliderChange}
              step={1000}
              marks={{
                0: `${this.state.minPriceFilter.toLocaleString()} vnđ`,
                30000000: `${this.state.maxPriceFilter.toLocaleString()} vnđ`
              }}
          />
        </div>
    );
  }
}

export default FilterBar;