const { Row, Col, Button, Link } = antd;
const { CalendarOutlined, CheckOutlined, CheckCircleFilled } = icons;

class ChatSignup extends React.Component {

  render() {
    let tutorDetails = this.props.tutorDetails;
    let interviewDate = '';
    if (notNull(interviewDate)) interviewDate = tutorDetails.interviewDate;
    let iframeExists = false;

    if (document.getElementById('my-deferred-iframe')) {
      iframeExists = true;
    }

    if (this.props.progress.hasScheduledChat && tutorDetails.status === '' && !iframeExists) {
          return (
            <div>
              <h1 className = "section-header-h1" > 20-Minute Interview</h1 >
              <div className="content-completed-container">
                <div className="appointment-confirmation-icon"><CalendarOutlined /></div>
                <p>{tutorDetails.firstname}, we have you confirmed for your appointment!</p>
                <p className="appointment-confirmation-title">20 Minute Zoom Interview</p>
                <p><strong>{new Date(interviewDate).toLocaleString([], { weekday: 'long', hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}</strong> </p>
                <div>
                  <Link className="cancel-and-reschedule-links" href={`https://us-central1-acuity-82682.cloudfunctions.net/rescheduleAppointment?appointmentId=${tutorDetails.acuityAppointmentID}&email=${tutorDetails.email}`} target="_blank">Cancel & Reschedule</Link>
                  <p style={{ fontSize: '12px', paddingTop: '5px' }}>*Once buttton is clicked, appointment will be cancelled. </p>
                </div>
              </div>
            </div>
          )
    } else if (tutorDetails.status === 'Application Accepted') {
      return(
        <div>
          <h1 className="section-header-h1" > 20-Minute Interview <span className="header-completed-done-check">< CheckOutlined /></span> </h1 >
          <div className="content-completed-container">
            <img className="svg-completed-img" src="./meeting.svg" alt="calendar booked image"></img>
            <p>Thank you for completing the 20 minute interview with us, it was great to meet you {tutorDetails.firstname}.</p>
            <p>You're now one step closer to becoming a Step Up Tutor and making a difference in a child's life!</p>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="section-header-h1">20-Minute Interview</h1>
          <p className="section-p">We want to keep it casual, ask a few questions, and get to know you better!</p>
          <p className="section-p">All meetings with us are via Zoom, be on the lookout for the link in your confirmation email.</p>
          <p className="section-p">If you need assistance, please reach out to our Onboarding Manager at <strong><Link href='mailto:charmaine@stepuptutoring.org'>charmaine@stepuptutoring.org.</Link></strong></p>
          <div className="center-embed-iframe">
            <iframe id="my-deferred-iframe" title="Schedule Appointment" width="90%" height="600" frameBorder="0" src={`https://app.acuityscheduling.com/schedule.php?owner=21394641&appointmentType=18777910&firstName=${this.props.tutorDetails.firstname}&lastName=${this.props.tutorDetails.lastname}&email=${this.props.tutorDetails.email}`} />
          </div>
        </div>
      )
    }
  }
}
