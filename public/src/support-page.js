const { Row, Col, Button } = antd;
const { QuestionOutlined, SnippetsOutlined, ScheduleOutlined, MailOutlined, CalendarOutlined, BugOutlined } = icons;
const { Link } = Typography

function OPEN_HEYMARKET() {
  try { HeymarketWidget.Modal.handleFabButtonClicked()
  } catch (e) {
    console.log('widget not responding from support paage');
  }
}

class SupportPageItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const subItem = this.props.subItem

    return (
      <Col span={11} className="support-item-col">
        <Button type="link" className="support-page-link" href={subItem.link} onClick={subItem.keyId === 'contact' ? OPEN_HEYMARKET : null} target="_blank">
          <div className="support-col-outer-div">
            <div className="support-item-icon" >{subItem.icon}</div>
            <div className="support-item-inner-div">{subItem.title.toUpperCase()}</div>
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
          <h3>Hey there, you lost? Here are some helpful links to answer your question or get in contact with one of our onboarding team members!</h3>
        </div>

        <div className="support-container">
          <Row className="support-gutter" gutter={[12, 24]}>
            {this.props.sidebarItems[1].subItems.map((subItem, key) => {
              return <SupportPageItem key={key} subItem={subItem} />})
            }
          </Row>
        </div>
      </div>
    )
  }
}
