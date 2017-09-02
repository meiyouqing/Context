import React, { Component } from 'react'
import { fetchArticle } from './utils/api'

class Detail extends Component {
    state = { html:null }
    componentWillReceiveProps(nextProp){
        const path = this.props.location.pathname;
        const newPath = nextProp.location.pathname;
        if (path !== newPath){
            this.getData(newPath);
        }
    }
    componentDidMount(){console.log('DETAIL')
        const path = this.props.location.pathname;
        this.getData(path);
        this.props.unBindEvent();
    }
    getData = path => {
        fetchArticle(path+'/article.json')
        .then(data => {
            this.setState({ html:data.content })
        })
    }
    goBack = () => {
        this.props.bindEvent();
        this.props.history.push('/');
    }
    render() {
        const { html } = this.state;
        if(!html) return (<div></div>);
        return (
            <div className="detail-container">
                <div onClick={this.goBack} className="mask"></div>
                <div className="detail-content">
                    <h1>{ this.props.title }</h1>
                    <div dangerouslySetInnerHTML={{ __html:html }}></div>
                </div>
            </div>
        );
    }
}

export default Detail;
