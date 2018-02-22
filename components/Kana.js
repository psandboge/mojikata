import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const index = require("../assets/json/hiragana_index.json")
const chars = require("../assets/json/hiragana.json")

export default class Kana extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log(index)
        console.log(chars)
        console.log(index[0][1])//["ka"][1])
    }
    render() {
        return null

    }
}