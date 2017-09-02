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
                names.map(({ name, isPoint, handleNameClick, className, style, id, path }) => {
                    if(isPoint){
                        return(
                            <Link
                            key={ id }
                            to={ `/vamei${path}` }
                            className={ className }
                            style={ style }
                            onClick={ () => { handleNameClick(name) } }
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
