import * as React from 'react';
import { BackHandler, TouchableOpacity, View } from "react-native";
import Icons from 'react-native-vector-icons/MaterialIcons';
import BackIcon from '../assets/icons/BackIcon';

export default class BackButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.handleBackButtonClick}>
                    <BackIcon />
                </TouchableOpacity>
            </View>
        )
    }
}