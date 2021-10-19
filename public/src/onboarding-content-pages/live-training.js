const { Button, Link} = antd;
const { CalendarOutlined } = icons;

class LiveTraining extends React.Component {

  render() {
    const tutorDetails = this.props.tutorDetails;
    let iframeExists = false;

    if (document.getElementById('deferred-iframe')) {
      iframeExists = true;
    }

    if (tutorDetails.liveTrainingDate && !tutorDetails.liveTrainingCompleted && !iframeExists){
      return (
        <div>
          <h1 className="section-header-h1">Live Training</h1>
          <div className="content-completed-container">
            <div className="appointment-confirmation-icon"><CalendarOutlined /></div>
            <p>{tutorDetails.firstname}, we have you confirmed for your appointment!</p>
            <p className="appointment-confirmation-title">Live Training Session</p>
            <p><strong>{tutorDetails.liveTrainingDate}</strong></p>
            <div className="live-training-button-container">
              <Link href={`https://calendly.com/cancellations/${tutorDetails.calendlyInviteeID}`} target="_blank" className="cancel-and-reschedule-links">Cancel</Link>
              <Link href={`https://calendly.com/reschedulings/${tutorDetails.calendlyInviteeID}`} target="_blank" className="cancel-and-reschedule-links">Reschedule</Link>
            </div>
          </div>
        </div>
      )
    } else if (tutorDetails.liveTrainingCompleted) {
      return (
        <div>
          <h1 className="section-header-h1">Live Training <span className="header-completed-done-check">< CheckOutlined /></span> </h1>
          <div className="content-completed-container">
            <img className="svg-completed-img" src="./training.svg" alt="calendar booked image"></img>
            <p>You completed the live training {tutorDetails.firstname}!</p>
            <p>Now we know how awesome you are and can't wait for your future student to find out as well.</p>
          </div>
          </div>
      )
    } else {
      return (
        <div>
          <h1 className="section-header-h1">Live Training</h1>
          <p>Live training is a Zoom session, led by members of the Step up team.
            After this session, you’ll have a good understanding of the onboarding process, how matches are processed and what tutoring looks like.</p>
          <div id="live-training-calendly">
            <iframe id="deferred-iframe" title="Schedule Live Training" width="100%" height="800" frameBorder="0" src={`https://calendly.com/stepup-tut/training?name=${tutorDetails.firstname}%20${tutorDetails.lastname}&email=${tutorDetails.email}`} />
          </div>
        </div>
      )
    }
  }
}
