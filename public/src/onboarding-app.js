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
              disabled: true,
              complete: false
            },
            {
              keyId: 'workbook',
              icon: <BookOutlined />,
              title: 'Workbook',
              active: false,
              disabled: true,
              complete: false
            },
            {
              keyId: 'livescan',
              icon: <SecurityScanOutlined />,
              title: 'Background Check',
              active: false,
              disabled: true,  // make 'false' for testing
              complete: false
            },
            {
              keyId: 'live-training',
              icon: <RocketOutlined />,
              title: 'Live Training',
              active: false,
              disabled: true,  // make 'false' for testing
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
  }
          // subItems: [
          //   {
          //     keyId: 'chat-signup',
          //     icon: <CommentOutlined />,
          //     title: 'Chat Signup',
          //     active: false,
          //     disabled: false,
          //     complete: false
          //   },
          //   {
          //     keyId: 'waiver',
          //     icon: <SolutionOutlined />,
          //     title: 'Waiver',
          //     active: false,
          //     disabled: true,  // changed to true
          //     complete: false
          //   },
          //   {
          //     keyId: 'workbook',
          //     icon: <BookOutlined />,
          //     title: 'Workbook',
          //     active: false,
          //     disabled: true,  // chagned to true
          //     complete: false
          //   },
          //   {
          //     keyId: 'livescan',
          //     icon: <SecurityScanOutlined />,
          //     title: 'Background Check',
          //     active: false,
          //     disabled: true,  // make 'false' for testing
          //     complete: false
          //   },
          //   {
          //     keyId: 'live-training',
          //     icon: <RocketOutlined />,
          //     title: 'Live Training',
          //     active: false,
          //     disabled: true,  // make 'false' for testing
          //     complete: false
          //   }]
        // }
        // ]

          // {
        //   keyId: 'support',
        //   icon: <QuestionCircleOutlined />,
        //   title: 'Support',
        //   active: false,
        //   disabled: false,
        //   subItems: [
        //     {
        //       keyId: 'faq',
        //       title: 'FAQ',
        //       active: false,
        //       disabled: false
        //     },
        //     {
        //       keyId: 'tutor-resources',
        //       title: 'Tutor Resources',
        //       active: false,
        //       disabled: false
        //     },
        //     {
        //       keyId: 'office-hours',
        //       title: 'Sign up for office hours',
        //       active: false,
        //       disabled: false
        //     },
        //     {
        //       keyId: 'contact',
        //       title: 'Contact Laura',
        //       active: false,
        //       disabled: false
        //     },
        //   ]
        // }

  receiveUser(user) {
    console.log({ user });
    let currentStep = 0 //changed from 0 to 1 for testing

    // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Application Accepted') currentStep = 1
    // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Ready to Tutor') currentStep = 2
    // if ('Status' in user.data['user'] && user.data['user']['Status'] == 'Matched') currentStep = 4

    //Update the state with the received data
    this.setState({
      loading: false,
      userData: user.data.user,
      currentStep: currentStep
    })
  }

  setUserLocalStorage(user) {
    let firstname = user.data.user['First Name'];
    let lastname = user.data.user['Last Name'];
    let email = user.data.user['Email'];
    window.localStorage.setItem('userEmail', email);
    window.localStorage.setItem('userFirstName', firstname);
    window.localStorage.setItem('userLastName', lastname);
  }

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
        hasScheduledChat: scheduledChat,
        hasCompletedWaiver: completedWaiver,
        hasCompletedWorkbook: completedWorkbook,
        hasCompletedLiveScan: completedLiveScan,
        hasCompletedLiveTraining: completedLiveTraining
      }
    })
  }

  loadTutorData() {
    firebase.functions().httpsCallable('getTutorData')()
      .then(tutorDetailedResult => {
        this.receiveUser(tutorDetailedResult)
        this.setUserLocalStorage(tutorDetailedResult)
        this.setUserProgress(tutorDetailedResult)
          }
                  )
                  .catch(error => { console.log(error) }
                  )
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
        progress={this.state.progress} />
        )
  }
}
