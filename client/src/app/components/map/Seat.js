import React, {Component} from "react";
import PropTypes from "prop-types";

import globalConfig from "../../../config/globalConfig";
import placeholder from "../../../img/placeholder_profil.svg";

class Seat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearched: false,
            isActive: false,
            hidden: true
        };
        this.imgSrc = 0;
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
        this.showImg = this.showImg.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextState.hidden)
        if ((this.props.user === undefined && nextProps.user !== undefined) ||
            (nextProps.user === undefined && this.props.user !== undefined)) {
            return true;
        }
        if (this.props.user !== undefined && nextProps.user !== undefined &&
            (this.props.user.user.login !== nextProps.user.user.login ||
            this.state.isSearched !== nextState.isSearched)) {
            return true;
        }
        if (nextState.isSearched !== this.state.isSearched || nextState.isActive !== this.state.isActive || nextState.hidden !== this.state.hidden) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchedUser.length < globalConfig.minimalSearchInput && this.state.isSearched) {
            this.setState({isSearched: false});
        }
        else if (nextProps.user !== undefined &&
            nextProps.searchedUser.length >= globalConfig.minimalSearchInput &&
            ((nextProps.user.user.login.includes(nextProps.searchedUser.toLowerCase()) && !this.state.isSearched) ||
            (!nextProps.user.user.login.includes(nextProps.searchedUser.toLowerCase()) && this.state.isSearched))) {
            this.setState({isSearched: !this.state.isSearched});
        }
        if (nextProps.activeUser.id === 0 && this.state.isActive) {
            this.setState({isActive: false});
        }
        else if (nextProps.user !== undefined &&
            nextProps.activeUser.id !== 0 &&
            (nextProps.activeUser.id === nextProps.user.id)) {
            this.setState({isActive: true});
        } else {
            this.setState({isActive: false});
        }
    }

    addDefaultSrc(ev) {
        if (this.props.user !== undefined && this.imgSrc === 0) {
            ev.target.src = `https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.JPG`;
        } else if (this.props.user !== undefined && this.imgSrc === 1) {
            ev.target.src = `https://cdn.intra.42.fr/users/large_${this.props.user.user.login}.jpg`;
        } else {
            ev.target.src = placeholder;
        }
        this.imgSrc += 1;
    }

    showImg() {
        this.setState({
            hidden: false
        });
    }

    render() {
        if (this.props.user === undefined) {
            return (
                <div className={"seat"} />
            );
        }
        else {
            return (
                <div className={"seat taken"}>
                    <div
                        className={this.state.isSearched || this.state.isActive ? `seatHover highlighted ${this.props.user.pool ? "newbie" : ""}` : `seatHover ${this.props.user.pool ? "newbie" : ""}`}
                        onClick={() => {
                            if (this.props.mode === "passive") {
                                this.props.quitPassiveMode();
                                localStorage.removeItem("mode");
                            }
                            this.props.storeActiveUsers({
                                ...this.props.user,
                                hostname: this.props.hostname
                            });
                        }}
                    >
                        {!this.state.hidden &&  <div />}
                        <img
                            onError={this.addDefaultSrc}
                            onLoad={() => this.setState({hidden: false})}
                            src={`https://cdn.intra.42.fr/users/small_${this.props.user.user.login}.JPG`}
                            className={`userImg ${this.state.hidden ? "hiddenImg" : ""}`}
                        />
                    </div>
                </div>                    
            );
        }
    }
}

Seat.propTypes = {
    storeActiveUsers: PropTypes.func.isRequired,
    hostname: PropTypes.string,
    user: PropTypes.shape({
        login: PropTypes.string
    }),
    searchedUser: PropTypes.string
};

export default Seat;
