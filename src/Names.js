import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Names extends Component {
    render() {
        const { names, style } = this.props;
        // console.log(names)
        if(!names) return <div></div>;
        return (
            <div className="names" style={ style }>
            {
                names.map(({ name, isPoint, handlePoint, className, style, id, path }) => {
                    if(isPoint){
                        return(
                            <Link
                            key={ id }
                            to={ `/data_1${path}` }
                            className={ className }
                            onClick={ handlePoint }
                            style={ style }
                            >{ name }</Link>
                        )
                    }else{
                        return(
                            <b
                            key={ id }
                            className={ className }
                            style={ style }
                            >{ name }</b>
                        )
                    }
                })
            }
            </div>
        );
    }
}

export default Names;
