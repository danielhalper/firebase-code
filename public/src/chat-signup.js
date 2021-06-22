const { Row, Col } = antd;

class ChatSignup extends React.Component {

  render() {
    // no scroll
    //class="select-item-box select-item " use display:none to hide duplicate info
    //center form
   return (
    <div>
      <p>hi there</p>
      <p>We want to keep it casual, ask a few questions, and get to know you better!</p>

      <p>All meetings with us are via Zoom, be on the lookout for the link in your confirmation email.</p>

      <p>If you need assistance, please reach out to our Onboarding Specialist at laura@stepuptutoring.org or (205) 953-1894. If you have already signed up or completed session, please disregard.</p>

      <Row>
        <Col  xs={24}>
          <iframe  src="https://app.acuityscheduling.com/schedule.php?owner=21394641&appointmentType=19663042" title="Schedule Appointment" width="90%" height="800" frameBorder="0"></iframe><script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
        </Col>
      </Row>
    </div>
    )
  }
}
