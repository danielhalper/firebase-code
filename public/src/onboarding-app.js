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

    switch(user.status) {
      case 'Application Accepted':
        currentStep = 1
        break
      case 'Ready to Tutor':
        currentStep = 2
        break 
      case 'Status':
        currentStep = 4
        break
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
      userData: user,
      currentStep: currentStep
    })
  }


  // takes user data and sets info to localstorage for use in prefilling forms
  setUserLocalStorage(user) {
    let firstname = user.firstname;
    let lastname = user.lastname;
    let email = user.email;
    window.localStorage.setItem('userEmail', email);
    window.localStorage.setItem('userFirstName', firstname);
    window.localStorage.setItem('userLastName', lastname);
  }

  // takes user data and sets completed tracked items in state
  setUserProgress(user) {
    let scheduledChat = notNull(user.interviewDate);
    let completedWaiver = user.waiverCompleted;
    let completedWorkbook = user.workbookCompleted;
    let completedLiveScan = user.liveScanCompleted;
    let completedLiveTraining = user.liveTrainingCompleted;

    this.setState({
      progress:{
        hasScheduledChat: scheduledChat,
        hasCompletedWaiver: completedWaiver,
        hasCompletedWorkbook: completedWorkbook,
        hasCompletedLiveScan: completedLiveScan,
        hasCompletedLiveTraining: completedLiveTraining
      }
    })
  }

  loadTutorData() {
    firebase.functions().httpsCallable('getOnboardingTutor')()
      .then(result => {

        const tutorDetailedResult = result.data

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
    if (this.state.userData.status == 'Application Accepted') {
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
        onboarding
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
