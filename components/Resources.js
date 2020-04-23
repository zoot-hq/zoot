import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import Select from "react-native-picker-select";

export default class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maternal: {},
      wellness: {},
      child: {},
    };
  }
  setLocation(category, evt) {
    let stateObj = {};
    stateObj[category] = {
      x: evt.nativeEvent.layout.x,
      y: evt.nativeEvent.layout.y,
    };
    this.setState(stateObj);
  }
  autoScroll(category) {
    // if statement prevents an error if the user clicks 'Go to' in the drop down
    if (category) {
      this.scrollRef.scrollTo({
        x: this.state[category].x,
        y: this.state[category].y,
        animated: true,
      });
    }
  }
  render() {
    const pickerStyle = {
      inputIOS: {
        color: "gray",
        marginTop: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        alignSelf: "center",
        borderWidth: 1,
      },
      inputAndroid: {
        color: "gray",
        borderWidth: 1,
      },
      placeholderColor: "black",
    };
    return (
      <View style={styles.container}>
        <Text style={styles.title}>après</Text>
        {/* <Text style={styles.subtitle}>
          Please use our provided resources that we’ve curated just for you so
          that you can find professional mental healthcare providers and get
          help.
        </Text>
        <Select
          style={pickerStyle}
          onValueChange={(value) => this.autoScroll(value)}
          placeholder={{ label: "Select...", value: null }}
          items={[
            { label: "Maternal Mental Health", value: "maternal" },
            { label: "Wellness", value: "wellness" },
            { label: "Infant & Child Development", value: "child" },
          ]}
        ></Select> */}
        <ScrollView
          style={styles.scroll}
          ref={(ref) => {
            this.scrollRef = ref;
          }}
        >
          <Text
            onLayout={(event) => this.setLocation("maternal", event)}
            style={styles.categoryTitle}
          >
            Maternal Mental Health
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.postpartum.net/")}
          >
            <Text style={styles.subtitle}>
              Postpartum Support International
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://womensmentalhealth.org/")}
          >
            <Text style={styles.subtitle}>
              MGH Center for Women's Mental Health
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.nimh.nih.gov/index.shtml")
            }
          >
            <Text style={styles.subtitle}>
              National Institute of Mental Health
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.samhsa.gov/find-help/national-helpline"
              )
            }
          >
            <Text style={styles.subtitle}>SAMHSA Hotline</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>
            Crisis Text Line: Text “HELLO” to 741741
          </Text>
          <Text
            onLayout={(event) => this.setLocation("wellness", event)}
            style={styles.categoryTitle}
          >
            Wellness
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.youtube.com/user/yogawithadriene")
            }
          >
            <Text style={styles.subtitle}>Yoga with Adriene</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.umassmemorialhealthcare.org/umass-memorial-center-mindfulness"
              )
            }
          >
            <Text style={styles.subtitle}>
              Center for Mindfulness Guided Meditations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://mariashriver.com/sundaypaper/")
            }
          >
            <Text style={styles.subtitle}>Maria Shriver's Sunday Paper</Text>
          </TouchableOpacity>
          <Text
            onLayout={(event) => this.setLocation("child", event)}
            style={styles.categoryTitle}
          >
            Infant & Child Development
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.llli.org/")}
          >
            <Text style={styles.subtitle}>La Leche League</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://healthychildren.org/English/Pages/default.aspx"
              )
            }
          >
            <Text style={styles.subtitle}>HealthyChildren.org</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.pbs.org/parents")}
          >
            <Text style={styles.subtitle}>PBS Kids for Parents</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://childmind.org/")}
          >
            <Text style={styles.subtitle}>The Child Mind Institute</Text>
          </TouchableOpacity>
          {/* this empty View provides enough space below the resources that each category can scroll to the top when chosen */}
          <View style={styles.extraSpace}></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
  },
  scroll: {
    marginTop: 10,
  },
  title: {
    fontSize: 100,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 5,
    fontFamily: "CormorantGaramond-Light",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Futura-Light",
    marginTop: 5,
    marginLeft: 50,
    marginRight: 50,
  },
  categoryTitle: {
    fontSize: 30,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Futura-Light",
    marginTop: 40,
  },
  extraSpace: {
    height: 100,
  },
});
