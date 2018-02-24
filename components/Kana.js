import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {Svg, G, Path, Text} from 'react-native-svg';

const index = require("../assets/json/hiragana_index.json")
const chars = require("../assets/json/hiragana.json")

export default class Kana extends React.Component {
    constructor(props) {
        super(props);
        svgSize = props.width;
        this.state = {};
       console.log(svgSize)
       console.log(props)
    }
    render() {
        return <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}>
            <G scale={svgSize/109}>
                <G stroke="red" fill="none" stroke-width="13" >
                    <Path d="M14.38,24.73c2.3,0.54,6.52,0.78,8.81,0.54c21.57-2.27,44.44-5.64,64.9-5.98c3.83-0.06,6.12,0.26,8.04,0.53"/>
                    <Path d="M51,41.5c1.45,0.7,3.19,1.43,5.19,1.74c7.31,1.14,17.05,1.94,22.64,1.5c4.64-0.37,6.38,1.08,5.17,4.73C77.88,68,72.75,78.75,63.87,90.4c-7.6,9.97-10.12,3.22-12.62,0.2"/>
                    <Path d="M51.75,25.5c0.5,2,0.22,3.78-0.21,5.89C48.95,43.8,34.75,73.38,13.56,87.97"/>
                </G>
                <G>
                    <Text
                        fill="none"
                        stroke="purple"
                        fontSize="10"
                        fontWeight="bold"
                        x="7.50"
                        y="26.50"
                        textAnchor="middle">1</Text>
                    <Text
                        fill="none"
                        stroke="purple"
                        fontSize="10"
                        fontWeight="bold"
                        x="57.50"
                        y="41.50"
                        textAnchor="middle">2</Text>
                    <Text
                        fill="none"
                        stroke="purple"
                        fontSize="10"
                        fontWeight="bold"
                        x="43.50"
                        y="33.50"
                        textAnchor="middle">3</Text>
                </G>
            </G>
        </Svg>

    }
}