const { Row, Col, Button } = antd;
const { QuestionOutlined, SnippetsOutlined, ScheduleOutlined, MailOutlined, CalendarOutlined } = icons;
const { Link } = Typography

class SupportPageItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col span={11} className="support-item-col">
        <Button type="link" className="support-page-link" href={this.props.link} target="_blank">
          <div className="support-col-outer-div">
            <div className="support-item-icon" >{this.props.icon}</div>
            <div className="support-item-inner-div">{this.props.title.toUpperCase()}</div>
          </div>
        </Button>
      </Col>
    )
  }
}

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
            {this.props.sidebarItems[1].subItems.map((subItem, key) => {
              return <SupportPageItem link={subItem.link} icon={subItem.icon} title={subItem.title} key={key} />})
            }
          </Row>
        </div>
      </div>
    )
  }
}
