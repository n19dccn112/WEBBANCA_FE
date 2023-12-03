import React, {Component} from 'react'

import get from '../../api/callAPI';
import Event from "./Event";

export default class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    }
  }
  componentDidMount() {
    get('events')
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                events: res.data
              });
            }
          }
        })
  }
  render() {
    return (
        this.state.events.map((event, index) => {
          console.log("event: ", event)
            return (
                <Event key={index}
                          id={event.eventId}
                          name={event.eventName}
                          desc={event.eventDescription}
                          startDate={event.startDate}
                          endDate={event.endDate}
                          eventStatusId={event.eventStatusId}
                          deleteEvent={(id) => this.props.deleteEvent(id)}
                          handleEditEventId={(id) => this.props.handleEditEventId(id)}/>)
        })
    );
  }
}
