class OnboardingApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: {},
      currentStep: 0,
      loading: true,
      error: false,
      progress: {
        hasScheduledChat: false,
        hasCompletedWaiver: false,
        hasCompletedWorkbook: false,
        hasCompletedLiveScan: false,
        hasCompletedLiveTraining: false
      },
      sidebarItems: [
        {
          keyId: 'home',
          icon: <HomeOutlined />,
          title: 'Dashboard',
          active: true,
          disabled: false,
          isSteps: true,
          subItems: [
            {
              keyId: 'chat-signup',
              icon: <CommentOutlined />,
              title: 'Chat Signup',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'waiver',
              icon: <SolutionOutlined />,
              title: 'Waiver',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'workbook',
              icon: <BookOutlined />,
              title: 'Workbook',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'livescan',
              icon: <SecurityScanOutlined />,
              title: 'Background Check',
              active: false,
              disabled: false,
              complete: false
            },
            {
              keyId: 'live-training',
              icon: <RocketOutlined />,
              title: 'Live Training',
              active: false,
              disabled: false,
              complete: false
            }
          ]
        },
        {
          keyId: 'support',
          icon: <QuestionCircleOutlined />,
          title: 'Support',
          active: false,
          disabled: false,
          subItems: [
            {
              keyId: 'faq',
              title: 'FAQ',
              active: false,
              disabled: false
            },
            {
              keyId: 'tutor-resources',
              title: 'Tutor Resources',
              active: false,
              disabled: false
            },
            {
              keyId: 'office-hours',
              title: 'Sign up for office hours',
              active: false,
              disabled: false
            },
            {
              keyId: 'contact',
              title: 'Contact Laura',
              active: false,
              disabled: false
            },
          ]
        }
      ]
    }

    this.setUserProgress = this.setUserProgress.bind(this)
    this.disableSideItems = this.disableSideItems.bind(this)

  }

  calculateCurrentStep(user) {
    let currentStep = 0;

    if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Application Accepted') {
      currentStep = 1
    }
    if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Ready to Tutor') {
      currentStep = 2
    }
    if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Matched') {
      currentStep = 4
    }
    return currentStep
  }

  disableCompletedSidebarItems() {
    const sidebarItems = this.state.sidebarItems

    if(this.state.progress.hasCompletedWaiver) {
      const waiverIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId = 'waiver')
      sidebarItems[0].subItems[waiverIndex].disabled = true
    }

    this.setState({
      sidebarItems: sidebarItems
    })
  }

  // takes user data and sets currentStep
  receiveUser(user) {
    let currentStep = this.calculateCurrentStep(user)

    //Update the state with the received data
    this.setState({
      loading: false,
      userData: user.data.user,
      currentStep: 1
    })
  }


  // takes user data and sets info to localstorage for use in prefilling forms
  setUserLocalStorage(user) {
    let firstname = user.data.user['First Name'];
    let lastname = user.data.user['Last Name'];
    let email = user.data.user['Email'];
    window.localStorage.setItem('userEmail', email);
    window.localStorage.setItem('userFirstName', firstname);
    window.localStorage.setItem('userLastName', lastname);
  }

  // takes user data and sets completed tracked items in state
  setUserProgress(user) {
    let scheduledChat = false;
    let completedWaiver = false;
    let completedWorkbook = false;
    let completedLiveScan = false;
    let completedLiveTraining = false;

    if ('Interview Date' in user.data['user']) {
      scheduledChat = notNull(user.data['user']['Interview Date'])
    }
    if ('Waiver?' in user.data['user']) {
      completedWaiver = notNull(user.data['user']['Waiver?'])
    }
    if ('Section 2' in user.data['user']) {
      completedWorkbook = notNull(user.data['user']['Section 2'])
    }
    if ('Live Scan?' in user.data['user']) {
      completedLiveScan = notNull(user.data['user']['Live Scan?'])
    }
    if ('Live Training?' in user.data['user']) {
      completedLiveTraining = notNull(user.data['user']['Live Training?'])
    }

    this.setState({
      progress:{
        hasScheduledChat: true,
        hasCompletedWaiver: false,
        hasCompletedWorkbook: completedWorkbook,
        hasCompletedLiveScan: completedLiveScan,
        hasCompletedLiveTraining: completedLiveTraining
      }
    })

    console.log('user stuff', user);
  }

  loadTutorData() {
    firebase.functions().httpsCallable('getTutorData')()
      .then(tutorDetailedResult => {
        this.receiveUser(tutorDetailedResult)
        this.setUserLocalStorage(tutorDetailedResult)
        this.setUserProgress(tutorDetailedResult)
        this.disableSideItems()})
      .catch(error => {
        console.log(error)
      })
  }

  // Depending on what step in process user is, sidebar items will be enabled and clickable
  disableSideItems() {
    const sidebarItems = this.state.sidebarItems
    const userData = this.state.userData
    const hasScheduledChat = this.state.progress.hasScheduledChat

    if (!hasScheduledChat) {
      for (let i = 1; i < sidebarItems[0].subItems.length; i++) {
        sidebarItems[0].subItems[i]['disabled'] = true;
      }

      this.setState({ sidebarItems: sidebarItems})
      return
    }

    // at this point chat has been scheduled and becomes disabled
      sidebarItems[0].subItems[0]['disabled'] = true;

    //if waiver has been completed, disable waiver page
    if (this.state.progress.hasCompletedWaiver) {
      const waiverIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'waiver')
      sidebarItems[0].subItems[waiverIndex].disabled = true
    }

    // if workbook has been completed, disable workbook page
    if (this.state.progress.hasCompletedWorkbook) {
      const workbookIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'workbook')
      sidebarItems[0].subItems[workbookIndex].disabled = true
    }

    // if has passed interview, check if live scan & training have been completed, enable pages when not, otherwise disabled
    if ('Status' in userData && userData['Status'] == 'Application Accepted') {
      if (this.state.progress.hasCompletedLiveScan) {
        const livescanIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'livescan')
        sidebarItems[0].subItems[livescanIndex].disabled = true
      }
      if (this.state.progress.hasCompletedLiveTraining) {
        const liveTrainingIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'live-training')
        sidebarItems[0].subItems[liveTrainingIndex].disabled = true
      }
    } else {
      const lScanIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'livescan')
      sidebarItems[0].subItems[lScanIndex].disabled = true

      const lTrainingIndex = sidebarItems[0].subItems.findIndex(subItemObj => subItemObj.keyId == 'live-training')
      sidebarItems[0].subItems[lTrainingIndex].disabled = true
    }

    this.setState({
      sidebarItems: sidebarItems
    })
  }

componentDidMount() {
  FIREBASE_RUN_ON_READY.push((user) => {
    this.loadTutorData()
  })
}


  render() {
    return (
      <SidebarLayout
        pages={{
          'home': Home,
          'waiver': Waiver,
          'chat-signup': ChatSignup,
          'workbook': Workbook,
          'livescan': BackgroundCheck,
          'live-training': LiveTraining
        }}
        sidebarItems={this.state.sidebarItems}
        currentTab='home'
        userData={this.state.userData}
        currentStep={this.state.currentStep}
        loading={this.state.loading}
        error={this.state.error}
        progress={this.state.progress}
        setUserProgress={this.state.setUserProgress}
        disableSideItems={this.state.disableSideItems}
      />
    )
  }
}
