import React from 'react';
import { Button, Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import Svg, {Circle, G, Path, Text as Txt} from 'react-native-svg';
import Kana from "./components/Kana";

const index = require("./assets/json/hiragana_index.json")
const { width, height } = Dimensions.get('window');
const svgSize = width*0.9
//const yoff = height/6
//const xoff = (width - svgSize)/2
export default class App extends React.Component {
    constructor () {
        super();
//        console.log("yoff " + yoff)
//        console.log("xoff " + xoff)
        console.log("width" + width)
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
            svgMaster: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}>
                <G scale={svgSize/109}>
                <G id="StrokePaths_04e07" stroke="red" fill="none" stroke-width="13" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;">
                    <G id="04e07" element="万">
                        <G id="04e07-g1" element="一" radical="general">
                            <Path id="04e07-s1" type="㇐" d="M14.38,24.73c2.3,0.54,6.52,0.78,8.81,0.54c21.57-2.27,44.44-5.64,64.9-5.98c3.83-0.06,6.12,0.26,8.04,0.53"/>
                        </G>
                        <Path id="04e07-s2" type="㇆" d="M51,41.5c1.45,0.7,3.19,1.43,5.19,1.74c7.31,1.14,17.05,1.94,22.64,1.5c4.64-0.37,6.38,1.08,5.17,4.73C77.88,68,72.75,78.75,63.87,90.4c-7.6,9.97-10.12,3.22-12.62,0.2"/>
                        <Path id="04e07-s3" type="㇒" d="M51.75,25.5c0.5,2,0.22,3.78-0.21,5.89C48.95,43.8,34.75,73.38,13.56,87.97"/>
                    </G>
                </G>
                <G id="StrokeNumbers_04e07" style="font-size:8;fill:#808080">
                    <Txt
                        fill="none"
                        stroke="purple"
                        fontSize="10"
                        fontWeight="bold"
                        x="7.50"
                        y="26.50"
                        textAnchor="middle">1</Txt>
                    <Txt
                        fill="none"
                        stroke="purple"
                        fontSize="10"
                        fontWeight="bold"
                        x="57.50"
                        y="41.50"
                        textAnchor="middle">2</Txt>
                    <Txt
                        fill="none"
                        stroke="purple"
                        fontSize="10"
                        fontWeight="bold"
                        x="43.50"
                        y="33.50"
                        textAnchor="middle">3</Txt>
                </G>
                </G>
            </Svg>
    };
        this._handlePanResponderMove = this._handlePanResponderMove.bind(this)

    }
    componentWillMount () {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderRelease
        });
    }

    _handlePanResponderMove (evt, gestureState) {
        let xdiff = gestureState.x0 - gestureState.moveX
        let ydiff = gestureState.y0 - gestureState.moveY
        let x = gestureState.moveX
        let y = gestureState.moveY

        let ps = this.state.ps;
        let cx = this.state.cx;
        let cy = this.state.cy;
        this.state.cnt += 1;

        cx.push(x - this.state.xoff)//scale;
        cy.push(y - this.state.yoff);
        if (ps.length > 35) {
            ps.splice(17,1);
            cx.splice(17,1);
            cy.splice(17,1);
        }

        let l1 = null;
        if (cx.length > 1) {
            let lcs = "M" + (cx[0]) + "," + (cy[0]);
            for (let x = 1; x < cx.length; x++) {
                lcs = lcs + "L" + cx[x] + "," + cy[x];
            }
            l1 = React.createElement(Path, {key:"p" + this.state.cnt, d:lcs, fill:"none", stroke:"green", strokeWidth:"4"})
            ps = React.createElement(Path, {key:"p" + this.state.cnt, d:lcs, fill:"none", stroke:"blue", strokeWidth:"4"})
        } else {
            ps=React.createElement(Circle,  {key:this.state.cnt, cx:x/2-this.state.xoff, cy:y/2-this.state.yoff, r:"2", stroke:"blue"}, "");
        }

        let vbox = "0 0 " + svgSize + " " + svgSize
        let newSvg = React.createElement(Svg,{width:svgSize, height:svgSize, viewBox:vbox},
            this.state.lines.concat(l1));

        this.setState({
            svg1: newSvg,
            position: {
                x: gestureState.moveX,
                y: gestureState.moveY
            },
            ps: ps
        })
    }
    _handlePanResponderRelease = () => {
        let l = this.state.lines.slice();
        l.push(this.state.ps);
        this.setState({
            lines: l,
            ps:[],
            cx:[],
            cy:[]
        })
    }
  render() {
      console.log("glyph: " + this.state.glyph)
    return (
      <View style={styles.container}>
          <View onLayout = {(n) => this.getCoordinates(n)} {...this._panResponder.panHandlers} style={styles.svgs}>
              <View style = {styles.svg1}>
                  {this.state.svg1}
                  <View style = {this.state.showMaster ? styles.svg2: styles.svgHidden}>
                      <Kana width={svgSize} character = {this.state.glyph}/>
                  </View>
              </View>
          </View>
          <View style = {styles.brow}>
          <View style = {styles.text}>
              <Button color='#222' title = {this.state.text} onPress = {(evt) => {}}/>
          </View>
          <View style = {styles.butt}>
              <Button color='#eee' title = "Rensa" onPress = {(evt) => this.handleResetPress(evt)}/>
          </View>
          <View style = {styles.nextButt}>
              <Button color='#eee' title = "Nästa" onPress = {(evt) => this.handleNext(evt)}/>
          </View>
          <View style = {styles.hideButt}>
              <Button color='#eee' title = "Visa" onPress = {(evt) => this.handleHidePress(evt)}/>
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
        let next = (this.state.current + 1) % index.length
        this.setState({
            current: next,
            text: index[next][0],
            glyph: index[next][1],
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            svg1: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}/>,
        })
        console.log("NextState: " + this.state)
    }

    getCoordinates(n) {
        console.log("Coordinates:  " + n.nativeEvent.layout.y)
        this.setState({
            xoff: n.nativeEvent.layout.x,
            yoff: n.nativeEvent.layout.y
        })
    }
}

const styles = StyleSheet.create({
    container: {
//    position: 'absolute',
        flex: 1,
//      top:0,
//      left:0,
//        height:height,
//      width:width,
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
        // position: 'absolute',
        // top:height/1.5 -40,
        // left:width/8,
        backgroundColor: '#ee0',
    },
    butt: {
        margin: 3,
        // position: 'absolute',
        // top:height/1.5,
        // left:width/8,
        backgroundColor: '#b23',
    },
    hideButt: {
        margin: 3,
        // position: 'absolute',
        // top:height/1.5,
        // right:width/8,
        backgroundColor: '#b23',
    },
    nextButt: {
        margin: 3,
        // position: 'absolute',
        // top:height/1.5,
        // right:width/8*3,
        backgroundColor: '#b23',
    },
    svgs: {
        // position:'absolute',
        // top:yoff,
        // left:xoff,
        backgroundColor: '#fff',
    },
    svg1: {
//        position:'absolute',
//        top:0,
//        left:0,
        backgroundColor: '#eeb',

        transform: [
            {
                scale: 1
            },
            {
                translateX :0
            },
            { translateY:0}

        ]
    },
    svg2: {
        position:'absolute',
        top:0,
        left:0,
        backgroundColor: '#f8d0',

        transform: [
            {
                scale: 1
            },
            {
                translateX :0
            },
            { translateY:0}

        ]
    },
    svgHidden: {
        position:'absolute',
        top:0,
        left:0,
        backgroundColor: '#a8df',

        transform: [
            {
                scale: 1
            },
            {
                translateX :-1000
            },
            { translateY:0}

        ]
    }
});
