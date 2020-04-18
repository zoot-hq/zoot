import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Picker,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";

export default Resources = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>après</Text>
      <Text style={styles.subtitle}>
        Please use our provided resources that we’ve curated just for you so
        that you can find professional mental healthcare providers and get help.
      </Text>
      <ScrollView>
        <Text
          // onLayout={(event) => {
          //   const layout = event.nativeEvent.layout;
          //   this.setState({
          //     scrollX: layout.x,
          //     scrollY: layout.y,
          //   });
          // }}
          style={styles.categoryTitle}
        >
          Maternal Mental Health
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.postpartum.net/")}
        >
          <Text style={styles.subtitle}>Postpartum Support International</Text>
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
        <Text style={styles.categoryTitle}>Wellness</Text>
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
        <Text style={styles.categoryTitle}>Infant & Child Development</Text>
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
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.commonsensemedia.org/")}
        >
          <Text style={styles.subtitle}>Common Sense Media</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
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
  picker: {
    margin: 5,
  },
});
