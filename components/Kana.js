import React from 'react';
import {Svg, G, Path, Text} from 'react-native-svg';

const index = require("../assets/json/hiragana_index.json");
const chars = require("../assets/json/hiragana.json");

export default class Kana extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            texts: [],
        };
        svgSize = props.width;
        this.getSvg(props);
    }
    componentWillMount() {
        // setInterval(() => {
        //     let chr = this.state.character;
        //     this.getSvg({chr});
        // }, 200);
    }
    getSvg(props) {
        this.state.lines = [];
        this.state.texts = [];
        let character = chars.hiragana[props.character];
        this.state.character = character;
        let paths = character.path;
        this.state.strokeCount = this.state.strokeCount + 1;
        let cnt = this.state.strokeCount;
        let texts = character.text;
        for (let i = 0; i < paths.length; i++) {
            this.state.lines = this.state.lines.concat(React.createElement(Path, {
                key: "sv" + i,
                d: paths[i],
                fill: "none",
                stroke: "grey",
                strokeWidth: "1",
            }));
            this.state.lines = this.state.lines.concat(React.createElement(Path, {
                key: "s" + i,
                d: paths[i],
                fill: "none",
                stroke: "red",
                strokeWidth: "1",
                // strokeDasharray: [50, 50],
                // strokeDashoffset: 20
            }));
        }
        for (let i = 0; i < texts.length; i++) {
            let raw = texts[i].transform;
            let s = raw.split(' ');
            let x = s[4];
            let y = s[5].substring(0, s[5].length - 1);
            let t = texts[i].value;
            this.state.texts = this.state.texts.concat(React.createElement(Text, {
                key: "t" + i, fill: "orange", stroke: "orange", fontSize: "8",
                x: x,
                y: y,
                textAnchor: "middle"
            }, t))
        }
    }

    componentWillUpdate(nextProps, nextState) {
        this.getSvg(nextProps)
    }

    render() {
        return <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}>
            <G scale={svgSize / 109}>
                 <G>
                    {this.state.lines}
                </G>
                <G>
                    {this.state.texts}
                </G>
            </G>
        </Svg>

    }
}