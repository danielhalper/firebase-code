//Required item component
class RequiredItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Link className='requirement' href={this.props.link} target='_blank'>
            <div>
            {this.props.icon && this.props.icon} {this.props.title}
                <p className='description'>
                    {this.props.children}
                </p>
            </div>
        </Link>;
    }
}
// Information Bar Component
class InformationBar extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const info = this.props.info.map((info) => 
                <div className = "info-item" key={info.id}>
                    <p className="info-label">{info.label}</p>
                    <h1 className="info-value">{info.value}</h1>
                </div>
        )
        return <div className="info-bar">
            {info}
        </div>
    }
}