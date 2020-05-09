import React from 'react';
import { Image, Text, View } from 'react-native';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';

export default class App extends React.Component {
    state = { areResourcesReady: false };

    constructor(props) {
        super(props);
        SplashScreen.preventAutoHide(); // Instruct SplashScreen not to hide yet
    }

    componentDidMount() {
        this.cacheResourcesAsync() // ask for resources
            .then(() => this.setState({ areResourcesReady: true })) // mark resources as loaded
            .catch(error => console.error(`Unexpected error thrown when loading:
${error.stack}`));
    }

    render() {
        if (!this.state.areResourcesReady) {
            return null;
        }

        return (
            <View style={{ flex: 1 }}>
                <Image
                    style={{ flex: 1, resizeMode: 'contain', width: 200, height: undefined }}
                    source={require('./assets/Comp-1_1.gif')}
                    onLoadEnd={() => {
                        // wait for image's content to fully load [`Image#onLoadEnd`] (https://facebook.github.io/react-native/docs/image#onloadend)
                        console.log('Image#onLoadEnd: hiding SplashScreen');
                        SplashScreen.hide(); // Image is fully presented, instruct SplashScreen to hide
                    }}
                    fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
                />
            </View>
        );
    }

    async cacheResourcesAsync() {
        const images = [require('./assets/Comp-1_1.gif')];
        const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());
        return Promise.all(cacheImages);
    }
}