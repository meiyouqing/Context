import React, { Component } from 'react';
import Names from './Names'

import { fetchContext } from './utils/api'

class Context extends Component {
    state = {
        names: null,
        namesStyle: {}
    }
    data = null
    componentDidMount() {
        console.log('CONTEXT')
        const canvas = this.cv;
        const vcanvas = document.createElement('canvas');
        const context = this;
        let names = [];

        const theme = {
            branch: [
                '183, 138, 66',
                '135, 158, 52',
                '51, 158, 158',
                '0, 104, 183',
                '116, 51, 158',
            ]
        }

        const ctx = canvas.getContext('2d');
        const vc = vcanvas.getContext('2d');

        const ww = window.innerWidth;
        const wh = window.innerHeight;
        canvas.setAttribute('width', ww)
        canvas.setAttribute('height', wh)

        //set vcanvas size
        let vw = 10000;
        let vh = 10000;

        //const origin = {x: -405, y: -628, scale: 0.17304067053021127, imgScale: 1}
        const origin = { x: -vw / 2 + ww / 2, y: -vh / 2 + wh / 2, scale: 1, imgScale: 1 };

        vc.save();

        function predraw() {
            if (!context.data) return;
            vcanvas.setAttribute('width', vw);
            vcanvas.setAttribute('height', vh);
            vc.clearRect(0, 0, vw, vh);
            recurDraw(context.data);
            context.setState({
                names,
                namesStyle: {
                    width: vw + 'px',
                    height: vh + 'px',
                    left: origin.x + 'px',
                    top: origin.y + 'px',
                }
            })
            names = [];
        }
        function recurDraw(o, parent) {
            const len = o.indexArr.length;
            if (origin.scale < 0.6) {
                if (len > 3) return;
                if (origin.scale < 0.15 || (o.cCount === 0 && origin.scale < 0.3)) {
                    if (len > 2) return;
                    if (origin.scale < 0.04) {
                        if (len > 1) return;
                    }
                }
            }

            draw(o, parent);

            if (o.children && o.children.length) {
                o.children.forEach(child => {
                    recurDraw(child, o);
                })
            }
        }
        function draw(o, parent) {
            parent = parent || o;
            const x = o.position.x * origin.scale;
            const y = o.position.y * origin.scale;
            const isPoint = !(o.children && o.children.length)
            const len = o.indexArr.length;

            names.push({
                name: o.name,
                isPoint,
                className: `level${len}${isPoint ? ' point' : ''}`,
                handlePoint: context.props.handlePoint,
                id: o.indexArr.join('-'),
                path: o.path,
                style: {
                    left: x + 'px',
                    top: y + 'px',
                    color: `rgb(${theme.branch[len - 1]})`,
                }
            })

            vc.beginPath();
            vc.moveTo(parent.position.x * origin.scale, parent.position.y * origin.scale);
            vc.lineTo(x, y);
            vc.strokeStyle = `rgba(${theme.branch[len - 1]},.5)`;
            vc.lineWidth = 6 / len;
            vc.stroke();
            vc.closePath();

            //draw circle point
            vc.arc(x, y, (1 / Math.pow(len / 9, 1)), 0, Math.PI * 2, true);
            vc.fillStyle = `rgb(${theme.branch[len - 1]})`;
            vc.fill();

        }

        function drawImage() {
            ctx.clearRect(0, 0, ww, wh);
            ctx.canvas.width = ctx.canvas.width;
            ctx.drawImage(vcanvas, origin.x, origin.y, vw * origin.imgScale, vh * origin.imgScale);
        }
        //ctx.scale(1,1);
        function bindEvent() {
            document.body.onmousedown = event => {
                if (event.button !== 0) return;

                document.body.onmousemove = e => {
                    window.requestAnimationFrame(() => {
                        canvas.style.cursor = "url(openhand.cur),move";
                        const _x = e.clientX;
                        const _y = e.clientY;
                        const x = event.clientX;
                        const y = event.clientY;
                        //set origin value
                        origin.x += (_x - x) / 5;
                        origin.y += (_y - y) / 5;
                        //begin predraw
                        clearNames();
                        drawImage();
                    })
                }
                document.body.onmouseup = () => {
                    document.body.onmousemove = null;
                    document.body.onmouseup = null;
                    canvas.style.cursor = "default";
                    predraw();
                }
            }

            //mousewheel scale event
            let timeoutId = 0;
            document.body.onwheel = document.body.onmousewheel = event => {
                window.requestAnimationFrame(() => {
                    const wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40));
                    let rate = 1;
                    //scale up limiting
                    if (wheelDelta > 0 && origin.scale > 1.2) {
                        return;
                    }
                    rate = wheelDelta > 0 ? 1.02 : 0.98;
                    origin.imgScale *= rate;
                    origin.scale *= rate;
                    origin.x = Math.round((origin.x * rate) - (event.clientX * (rate - 1)));
                    origin.y = Math.round((origin.y * rate) - (event.clientY * (rate - 1)));
                    // console.log(wheelDelta,origin.scale,origin.x,origin.y)
                    drawImage();
                    clearNames();
                    // console.log(lastWhellDelta, wheelDelta)
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        // console.log('wheel scale predraw')
                        // console.log(origin.imgScale)
                        // console.log(origin.scale)
                        vw *= origin.imgScale;
                        vh *= origin.imgScale;
                        origin.imgScale = 1;
                        predraw();
                        drawImage();
                    }, 300)
                })
            }
        }
        function clearNames() {
            context.setState({ names: null })
        }
        function getContext() {
            fetchContext.then(json => {
                context.data = json;
                predraw();
                drawImage();
            })
        }
        getContext();
        bindEvent();
    }
    render() {
        return (
            <div className="context">
                <Names names={this.state.names} style={this.state.namesStyle} />
                <canvas className="map-canvas" ref={(cv) => (this.cv = cv)}></canvas>
            </div>
        );
    }
}

export default Context;
