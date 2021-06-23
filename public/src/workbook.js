const { Row, Col, Tabs } = antd;
const { TabPane } = Tabs;
const { RightOutlined } = icons;

class Workbook extends React.Component {

  render() {
    // no scroll
    //class="select-item-box select-item " use display:none to hide duplicate info
    //center form
    return (
      <div>
        <h1>Training Modules</h1>
        <h3>Approximate time: 1-2 hours</h3>
        <p>Please take your time when completing the Step Up workbook. It is essential for....</p>
        <div>
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Program Summary" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="General Expectations" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Sexual Harassment and Boundaries" key="3">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="Teaching Math" key="4">
              Content of Tab Pane 4
            </TabPane>
            <TabPane tab="Teaching Reading" key="5">
              Content of Tab Pane 5
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
