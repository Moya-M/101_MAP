import React, {Component} from "react";

class Toast extends Component {
    constructor() {
        super();
        this.renderButton = this.renderButton.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
        this.transitionDuration = 600;
        this.state = {
            transition: "off"
        };
    }
    componentDidMount() {
        if (this.props.toast.type === "error") {
            console.error(this.props.toast.message);
        }
        setTimeout(() => {
            this.setState({
                transition: "on"
            });
        }, 100);
        if (typeof(this.props.toast.timeout) === "number")
            setTimeout(() => {
                this.dismissToast();
            }, this.props.toast.timeout);
    }

    dismissToast() {
        this.setState({
            transition: "off"
        });
        setTimeout(() => {
            this.props.hideToast({id: this.props.id});
        }, this.transitionDuration);
    }

    renderButton(){
        if (this.props.toast.action !== null) {
            return (
                <div className="toast-action-wrapper">
                    <button className="toast-action" onClick={() => {
                        this.props.toast.action.func();
                        this.dismissToast();
                    }}>
                        {this.props.toast.action.label}
                    </button>
                </div>
            );
        }
    }
    chooseIcons() {
        switch(this.props.toast.type) {
        case "info":
            return "fa-info";
        case "success":
            return "fa-check";
        case "warn":
            return "fa-exclamation-triangle";
        case "error":
            return "fa-exclamation-circle";
        }
    }
    renderIcons() {
        if (this.props.toast.action === null) {
            return (
                <i className={`icon-type fas ${this.chooseIcons()}`}></i>  
            );
        }
    }

    render() {
        return (
            <div className={`toast ${this.state.transition} ${this.props.toast.type}`}>
                <div className="content">
                    {this.renderButton()}
                    <div className="message">
                        {this.renderIcons()}
                        <p>
                            {this.props.toast.message}
                        </p>
                    </div>
                </div>
                <button className="dismiss-toast" onClick={() => this.dismissToast()}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
        );
    }
}

export default Toast;