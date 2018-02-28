import React from 'react';
import {Button, Dimensions, PanResponder, StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import Kana from "./components/Kana";

const index = require("./assets/json/hiragana_index.json");
const {width, height} = Dimensions.get('window');
const svgSize = width < height ? width * 0.9 : height * 0.9;
export default class App extends React.Component {
    constructor() {
        super();
        console.log("width" + width);
        this.state = {
            xoff: 0,
            yoff: 0,
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            current: 0,
            text: index[0][0],
            glyph: index[0][1],
            cnt: 412,
            showMaster: false,
            svg1: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}/>,
            svgMaster: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}/>
        };
        this._handlePanResponderMove = this._handlePanResponderMove.bind(this);

    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderRelease
        });
    }

    _handlePanResponderMove(evt, gestureState) {
        let x = gestureState.moveX;
        let y = gestureState.moveY;

        let ps = this.state.ps;
        let cx = this.state.cx;
        let cy = this.state.cy;
        this.state.cnt += 1;

        cx.push(x - this.state.xoff);
        cy.push(y - this.state.yoff);
        if (ps.length > 35) {
            ps.splice(17, 1);
            cx.splice(17, 1);
            cy.splice(17, 1);
        }

        let l1 = null;
        if (cx.length > 1) {
            let lcs = "M" + (cx[0]) + "," + (cy[0]);
            for (let x = 1; x < cx.length; x++) {
                lcs = lcs + "L" + cx[x] + "," + cy[x];
            }
            l1 = React.createElement(Path, {
                key: "p" + this.state.cnt,
                d: lcs,
                fill: "none",
                stroke: "green",
                strokeWidth: "4"
            });
            ps = React.createElement(Path, {
                key: "p" + this.state.cnt,
                d: lcs,
                fill: "none",
                stroke: "blue",
                strokeWidth: "4"
            });
        } else {
            ps = React.createElement(Circle, {
                key: this.state.cnt,
                cx: x / 2 - this.state.xoff,
                cy: y / 2 - this.state.yoff,
                r: "2",
                stroke: "blue"
            }, "");
        }

        let vbox = "0 0 " + svgSize + " " + svgSize;
        let newSvg = React.createElement(Svg, {width: svgSize, height: svgSize, viewBox: vbox},
            this.state.lines.concat(l1));

        this.setState({
            svg1: newSvg,
            position: {
                x: gestureState.moveX,
                y: gestureState.moveY
            },
            ps: ps
        });
    }

    _handlePanResponderRelease = () => {
        let l = this.state.lines.slice();
        l.push(this.state.ps);
        this.setState({
            lines: l,
            ps: [],
            cx: [],
            cy: []
        });
    };

    render() {
        console.log("glyph: " + this.state.glyph);
        return (
            <View style={styles.container}>
                <View onLayout={(n) => this.getCoordinates(n)} {...this._panResponder.panHandlers} style={styles.svgs}>
                    <View style={styles.svg1}>
                        {this.state.svg1}
                        <View style={this.state.showMaster ? styles.svg2 : styles.svgHidden}>
                            <Kana width={svgSize} character={this.state.glyph}/>
                        </View>
                    </View>
                </View>
                <View style={styles.brow}>
                    <View style={styles.text}>
                        <Button color='#222' title={this.state.text} onPress={(evt) => {
                        }}/>
                    </View>
                    <View style={styles.butt}>
                        <Button color='#eee' title="Rensa" onPress={(evt) => this.handleResetPress(evt)}/>
                    </View>
                    <View style={styles.nextButt}>
                        <Button color='#eee' title="Nästa" onPress={(evt) => this.handleNext(evt)}/>
                    </View>
                    <View style={styles.hideButt}>
                        <Button color='#eee' title="Visa" onPress={(evt) => this.handleHidePress(evt)}/>
                    </View>
                </View>
            </View>
        );
    }

    handleResetPress(evt) {
        this.setState({
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            svg1: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}/>,
        })
    }

    handleHidePress(evt) {
        this.setState({
            showMaster: !(this.state.showMaster)
        })
    }

    handleNext(evt) {
        let next = (this.state.current + 1) % index.length;
        this.setState({
            current: next,
            text: index[next][0],
            glyph: index[next][1],
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            svg1: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}/>,
        });
        console.log("NextState: " + this.state)
    }

    getCoordinates(n) {
        console.log("Coordinates:  " + n.nativeEvent.layout.y);
        this.setState({
            xoff: n.nativeEvent.layout.x,
            yoff: n.nativeEvent.layout.y
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brow: {
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    text: {
        margin: 3,
        backgroundColor: '#ee0',
    },
    butt: {
        margin: 3,
        backgroundColor: '#b23',
    },
    hideButt: {
        margin: 3,
        backgroundColor: '#b23',
    },
    nextButt: {
        margin: 3,
        backgroundColor: '#b23',
    },
    svgs: {
        backgroundColor: '#fff',
    },
    svg1: {
        backgroundColor: '#eeb',

        transform: [
            {
                scale: 1
            },
            {
                translateX: 0
            },
            {translateY: 0}

        ]
    },
    svg2: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#f8d0',

        transform: [
            {
                scale: 1
            },
            {
                translateX: 0
            },
            {translateY: 0}

        ]
    },
    svgHidden: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#a8df',

        transform: [
            {
                scale: 1
            },
            {
                translateX: -1000
            },
            {translateY: 0}

        ]
    }
});
