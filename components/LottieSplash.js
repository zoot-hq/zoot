import React from 'react';
import LottieView from 'lottie-react-native';

export default class LottieSplash extends React.Component {
    render() {
        return <LottieView source={require('../assets/data.json')} autoPlay loop />;
    }
}