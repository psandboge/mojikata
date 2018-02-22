import React from 'react';
import { Button, Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import Svg, {Circle, G, Path, Text as Txt} from 'react-native-svg';
import Kana from "./components/Kana";

const { width, height } = Dimensions.get('window');
const svgSize = width*0.9
const ypos = height/3
const yoff = height/6
const xoff = (width - svgSize)/2
const xpos = xoff
export default class App extends React.Component {
    // state = {
    // };
    constructor () {
        super();
        console.log("ypos " + ypos)
        console.log("ypos " + yoff)
        console.log("xpos " + xpos)
        console.log("xpos " + xoff)
        console.log("width" + width)
        this.state = {
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            cnt: 412,
            showMaster: false,
        // position: {
        //     x: ( width) - 100, y: (height) - 100,
//        },
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
//        this._handlePanResponderRelease = this._handlePanResponderRelease.bind(this)

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

        //let p = this.state.svg.createSVGPoint //this.state.position.x, this.state.position.y);

        let ps = this.state.ps;
        let cx = this.state.cx;
        let cy = this.state.cy;
        this.state.cnt += 1;

        cx.push(x - xoff)//scale;
        cy.push(y - yoff);
        if (ps.length > 35) {
            ps.splice(17,1);
            cx.splice(17,1);
            cy.splice(17,1);
        }

        let l1 = null;
        if (cx.length > 1) {
            //let start = ps[0];
            let lcs = "M" + (cx[0]) + "," + (cy[0]);
            for (let x = 1; x < cx.length; x++) {
                //let circle = ps[x];
                lcs = lcs + "L" + cx[x] + "," + cy[x];
            }
            l1 = React.createElement(Path, {key:"p" + this.state.cnt, d:lcs, fill:"none", stroke:"green", strokeWidth:"4"})
            ps = React.createElement(Path, {key:"p" + this.state.cnt, d:lcs, fill:"none", stroke:"blue", strokeWidth:"4"})
        } else {
            ps=React.createElement(Circle,  {key:this.state.cnt, cx:x/2-40, cy:y/2-yoff, r:"2", stroke:"blue"}, "");
        }
        if (l1 != null) {
            //ps = l1;
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
      //  console.log('lines: ', this.state.lines)
        let l = this.state.lines.slice();
        l.push(this.state.ps);
        console.log(this.state.ps);
        this.setState({
            lines: l,
            ps:[],
            cx:[],
            cy:[]
        })
    }
  render() {
    return (
      <View style={styles.container}>
          {/*<WebView*/}
              {/*source={{html: '<html><head>\n' +*/}
                  {/*'    <meta charset="UTF-8">\n' +*/}
                  {/*'    <title>Grammatik</title>\n' +*/}
                  {/*'</head>\n' +*/}
                  {/*'<body>' +*/}
                  {/*'<p>Hej</p> ' +*/}
                  {/*'</body>'}}*/}
              {/*style={{width: 290,backgroundColor: '#def'}}*/}
          {/*>*/}

          {/*</WebView>*/}
          <View {...this._panResponder.panHandlers} style={styles.svgs}>
              {/*<TouchableOpacity*/}
                  {/*onPressIn={(evt) => this.handlePress(evt)}*/}
              {/*>*/}
              <View style = {styles.svg1}>
                  {this.state.svg1}
              </View>
              <View style = {this.state.showMaster ? styles.svg2: styles.svgHidden}>
                  {this.state.svgMaster}
              </View>
              {/*</TouchableOpacity>*/}
          </View>
              {/*<Text>{ this.state.position.x }</Text>*/}
              {/*<Text>{ this.state.position.y }</Text>*/}
        {/*<Text>Changes you make will automatically reload.</Text>*/}
        {/*<Text>Shake your phone to open the developer menu.</Text>*/}
          <View style = {styles.butt}>
              <Button color='#eee' title = "Reset" onPress = {(evt) => this.handleResetPress(evt)}/>
          </View>
          <View style = {styles.hideButt}>
              <Button color='#eee' title = "Show" onPress = {(evt) => this.handleHidePress(evt)}/>
          </View>
          <Kana/>
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
//        this.forceUpdate();
    }
    handleHidePress(evt) {
        this.setState({
            showMaster: !(this.state.showMaster)
        })
    }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
      top:0,
      left:0,
      height:height,
      width:width,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
    butt: {
        position: 'absolute',
        top:height/1.5,
        left:width/8,
        backgroundColor: '#b23',
    },
    hideButt: {
        position: 'absolute',
        top:height/1.5,
        right:width/8,
        backgroundColor: '#b23',
    },
    svgs: {
        position:'absolute',
        top:yoff,
        left:xoff,
        backgroundColor: '#fff',
    },
    svg1: {
        position:'absolute',
        top:0,
        left:0,
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
