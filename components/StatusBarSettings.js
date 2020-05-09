import React, { Component } from 'react';
import { StatusBar } from 'react-native'

const StatusBarSettings = () => {
    return (
        <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor="#00BCD4"
            translucent={true} />
    )
}

export default StatusBarSettings