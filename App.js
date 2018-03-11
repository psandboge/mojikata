import React from 'react';
import {
    Button,
    Dimensions,
    PanResponder,
    StyleSheet,
    View,
    SafeAreaView,
    ImageBackground,
    Image,
    Text,
    AsyncStorage,
    Platform
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import Kana from "./components/Kana";

const index = require("./assets/json/hiragana_index.json");
const {width, height} = Dimensions.get('window');
const svgSize = width < height ? width * 0.9 : height * 0.95;
const img = require("./assets/images/japanese_house.png");
const img2 = require("./assets/images/sky.png");
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            done: false,
            xoff: 0,
            yoff: 0,
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            current: 0,
            text: index[0][0],
            glyph: index[0][1],
            strokes: index[0][2],
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
        if (this.state.done) return;
        let x = gestureState.moveX;
        let y = gestureState.moveY;

        let ps = this.state.ps;
        let cx = this.state.cx;
        let cy = this.state.cy;
        let cLength = cx.length;
        this.state.cnt += 1;

        cx.push(x - this.state.xoff);
        cy.push(y - this.state.yoff);
        if (ps.length > 35) {
            ps.splice(17, 1);
            cx.splice(17, 1);
            cy.splice(17, 1);
        }

        let l1 = null;
        if (cLength > 1) {
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
        }

        let vbox = "0 0 " + svgSize + " " + svgSize;
        let newSvg = React.createElement(Svg, {width: svgSize, height: svgSize, viewBox: vbox},
            this.state.lines.concat(l1));

        this.setState({
            svg1: newSvg,
            ps: ps
        });
    }

    _handlePanResponderRelease = () => {
            let l = this.state.lines.slice();
            l.push(this.state.ps);
        if (l.length < this.state.strokes) {
            this.setState({
                lines: l,
                ps: [],
                cx: [],
                cy: []
            });
        } else {
            this.state.lines = l;
            this.setState({
                done: true,
                lines: l,
                showMaster:true
            });
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <ImageBackground style={styles.headerContainer} source={img2}>
                    <Text style={styles.title}>文字方</Text>
                </ImageBackground>
                <View onLayout={(n) => this.getCoordinates(n)} style={styles.container}>
                    <ImageBackground
                        source={img}
                        style={styles.imageContainer}
                        imageStyle={styles.image}>
                        <View {...this._panResponder.panHandlers}
                              style={styles.svgs}>
                            <View style={styles.svg1}>
                                {this.state.svg1}
                                <View style={this.state.showMaster ? styles.svgShow : styles.svgHidden}>
                                    <Kana width={svgSize} character={this.state.glyph}/>
                                </View>
                            </View>
                        </View>
                        <View style={styles.brow}>
                            <View style={styles.butt}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#b23'} title="Rensa" onPress={(evt) => this.handleResetPress(evt)}/>
                            </View>
                            <View style={styles.nextButt}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#b23'} title="Nästa" onPress={(evt) => this.handleNext(evt)}/>
                            </View>
                            <View style={styles.hideButt}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#b23'} title="Visa" onPress={(evt) => this.handleHidePress(evt)}/>
                            </View>
                            <View style={styles.undoButt}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#32b'} title="Ångra" onPress={(evt) => this.handleUndo(evt)}/>
                            </View>
                        </View>
                        <View style={styles.brow}>
                            <View style={this.state.showMaster ? styles.okButt : styles.okButtHidden}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#1b2'} title="Rätt" onPress={(evt) => this.handleOk(evt)}/>
                            </View>
                            <View style={this.state.showMaster ? styles.wrongButt : styles.wrongButtHidden}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#d12'} title="Fel" onPress={(evt) => this.handleWrong(evt)}/>
                            </View>
                            <View style={this.state.showMaster ? styles.replayButt : styles.replayButtHidden}>
                                <Button color={Platform.OS === 'ios' ?'#eee':'#152'} title="Historik" onPress={(evt) => this.handleReplay(evt)}/>
                            </View>
                        </View>
                        <View style={styles.brow}>
                            <View>
                                <Text style={styles.text}>{this.state.text}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </SafeAreaView>
        );
    }

    handleResetPress(evt) {
        this.setState({
            done: false,
            showMaster: false,
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
            done: false,
            showMaster: false,
            current: next,
            text: index[next][0],
            glyph: index[next][1],
            strokes: index[next][2],
            ps: [],
            lines: [],
            cx: [],
            cy: [],
            svg1: <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}/>,
        });
    }

    getCoordinates(n) {
        this.setState({
            xoff: n.nativeEvent.layout.x,
            yoff: n.nativeEvent.layout.y
        })
    }

    handleUndo(evt) {
        let len = this.state.lines.length;
        if (len > 0) {
            let l = this.state.lines.slice(0, len - 1);

            let vbox = "0 0 " + svgSize + " " + svgSize;
            let newSvg = React.createElement(Svg, {width: svgSize, height: svgSize, viewBox: vbox}, l);

            this.setState({
                done: false,
                svg1: newSvg,
                lines: l,
                ps: [],
                cx: [],
                cy: []
            });
        }
    }

    async handleOk(evt) {
        await this.persistResult(true);
        this.handleNext(evt);
    }

    async persistResult(b) {
        const glyph = this.state.glyph;
        const item = '@MojiKataStore:' + glyph;
        //await AsyncStorage.removeItem(item);
        let value = await AsyncStorage.getItem(item);
        if (value === null) {
            await AsyncStorage.setItem(item, "[]");
            value = await AsyncStorage.getItem(item);
        }
        let json = JSON.parse(value);
        if (value === "[]") {
            let newVal = '[' + JSON.stringify({correct: b, lines: this.state.lines}) + ']';
            console.log("New value" + newVal);
            AsyncStorage.setItem(item, newVal);
        } else {
            console.log("Append");
            let l = json.concat({correct: b, lines: this.state.lines});
            AsyncStorage.setItem(item, JSON.stringify(l));
        }
    }

    async handleWrong(evt) {
        await this.persistResult(false);
        this.handleResetPress(evt);
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        color: '#ddd',
        fontSize: 45,
        backgroundColor: '#fff2',
    },
    imageContainer: {
        flex: 1,
    },
    headerContainer: {
        backgroundColor: '#bbb',
        alignItems: 'center',
        alignSelf: 'stretch',
        width: null,
        height: 50
    },
    image: {
        flex: 1,
        width: null,
        height: null, resizeMode: 'cover',
    },
    safeContainer: {
        flex: 1,
        backgroundColor: '#aaa',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
//        backgroundImage: './assets/images/japanese_house.png',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    brow: {
        backgroundColor: '#0000',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    text: {
        margin: 3,
        backgroundColor: '#eee2',
        fontWeight: 'bold',
        color: '#ed3',
        fontSize: 145,
        textShadowColor: '#4448',
        textShadowRadius: 3,
        textShadowOffset: {width: 3, height: 3},
    },
    butt: {
        margin: 3,
        backgroundColor: '#b23',
    },
    hideButt: {
        margin: 3,
        backgroundColor: '#b23',
    },
    undoButt: {
        margin: 3,
        backgroundColor: '#32b',
    },
    nextButt: {
        margin: 3,
        backgroundColor: '#b23',
    },
    okButt: {
        margin: 3,
        backgroundColor: '#1b2',
    },
    wrongButt: {
        margin: 3,
        backgroundColor: '#d12',
    },
    replayButt: {
        margin: 3,
        backgroundColor: '#152',
    },
    okButtHidden: {
        margin: 3,
        backgroundColor: '#1b2',
        transform: [
            {
                scale: 1
            },
            {
                translateX: -1000
            },
            {translateY: 0}

        ]
    },
    wrongButtHidden: {
        margin: 3,
        backgroundColor: '#d12',
        transform: [
            {
                scale: 1
            },
            {
                translateX: -1000
            },
            {translateY: 0}

        ]
    },
    replayButtHidden: {
        margin: 3,
        backgroundColor: '#152',
        transform: [
            {
                scale: 1
            },
            {
                translateX: -1000
            },
            {translateY: 0}

        ]
    },
    svgs: {
        alignContent: 'flex-start',
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
    svgShow: {
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
