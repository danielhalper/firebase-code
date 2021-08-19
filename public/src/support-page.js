const { Row, Col, Button } = antd;
const { QuestionOutlined, SnippetsOutlined, ScheduleOutlined, MailOutlined, CalendarOutlined } = icons;

const { Link } = Typography

class SupportPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="support-header">
          <h1 className="section-header-h1" id="support-h1">Support</h1>
          <h3>Hey there you lost? Here are some helpful links to answer your question or get in contact with one of our team members!</h3>
        </div>

        <div className="support-container">
          <Row className="support-gutter" gutter={[12, 24]}>
            <Col span={11} className="support-item-col" >
              <Button type="link" className="support-page-link" href="https://docs.google.com/document/d/1Wc2ztcXHTxDC2uZar6RkoayDRr5itrcv05thvoSs1cs/edit" target="_blank">
                <div className="support-col-outer-div">
                  <QuestionOutlined className="support-item-icon" />
                  <div className="support-item-inner-div">FAQ</div>
                </div>
              </Button>
              </Col>
            <Col span={11} className="support-item-col">
              <Button type="link" className="support-page-link" href="https://www.stepuptutoring.org/resources" target="_blank">
                <div className="support-col-outer-div">
                  <SnippetsOutlined className="support-item-icon" />
                  <div className="support-item-inner-div">TUTOR RESOURCES</div>
                </div>
              </Button>
            </Col>
            <Col span={11} className="support-item-col">
              <Button type="link" className="support-page-link" href="https://www.stepuptutoring.org/contact" target="_blank">
                <div className="support-col-outer-div">
                  <MailOutlined className="support-item-icon" />
                  <div className="support-item-inner-div">CONTACT US</div>
                </div>
              </Button>
            </Col>
            <Col span={11} className="support-item-col">
              <Button type="link" className="support-page-link" href="https://www.stepuptutoring.org/tutor-events" target="_blank">
                <div className="support-col-outer-div">
                  <ScheduleOutlined className="support-item-icon" />
                  <div className="support-item-inner-div">SIGN UP FOR OFFICE HOURS</div>
                </div>
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
