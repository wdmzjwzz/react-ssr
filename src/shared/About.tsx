import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Store } from "redux";

interface IState {
  data: string;
}

class About extends React.Component<any, IState> {
  static loadData(store: Store) {
    return new Promise((resolve) => {
      axios.get("http://localhost:6024/getData").then((res) => {
        // 修改 store
        store.dispatch({
          type: "CHANGE_DATA",
          payload: {
            data: res.data.data,
          },
        });
        resolve();
      });
    });
  }
  componentDidMount() {
    if (!this.props.data) {
      axios.get("http://localhost:6024/getData").then((res) => {
        this.props.changeData(res.data.data);
      });
    }
  }
  render() {
    return (
      <div>
        <div>About</div>
        <div>{this.props.data}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeData(data) {
      dispatch({
        type: "CHANGE_DATA",
        payload: {
          data: data,
        },
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
