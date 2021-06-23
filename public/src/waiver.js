const { Row, Col } = antd;

class Waiver extends React.Component {

  componentDidMount() {
  const script = document.createElement("script");
  script.src = "https://paperform.co/__embed.min.js";
  document.body.appendChild(script);
};

  render() {
    // no scroll
    //class="select-item-box select-item " use display:none to hide duplicate info
    //center form


    return (
      <div>
        <p>The tutor waiver is a binding legal agreement between you (the tutor) and StepUp Tutoring. It outlines the tutor code of conduct, and responsibilities & expectations for our volunteer tutors. </p>

        <Row>
          <Col xs={24}>

            <div data-paperform-id="tqp1uzj8"></div>
          </Col>
        </Row>
      </div>
    )
  }
}
