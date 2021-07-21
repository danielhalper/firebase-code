class TutorHome extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        return <div style={{display:"flex", width:"100%"}}>
            <div style={{display:"flex", flexDirection:"row", flex:1}}>
            <div style={{flex:1}}></div>
            <InformationBar info={
                [
                    {
                        label:"Total Sessions",
                        id:"total_sessions",
                        type: "number",
                        value:7,
                    },
                    {
                        label:"Minutes Tutored",
                        id:"minutes_tutored",
                        type: "number",
                        value:323,
                    },
                    {
                        label:"Last Session",
                        id:"last_session",
                        type: "string",
                        value:"7/1/21",
                    },
                ]}/>
                <div style={{flex:1}}></div>
            </div>
        </div>
    }
}