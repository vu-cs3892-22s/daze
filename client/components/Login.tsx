import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
// import { AuthSession, WebBrowser, Linking } from "expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
export default class Login extends React.Component {
  state = {
    authResult: { type: "fail" },
  };
  render() {
    if (this.state.authResult.type === "success") {
      return (
        <View style={styles.container}>
          <Text>{`Hey there, user!`}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Button title="Login with Google" onPress={this.handleOAuthLogin} />
        </View>
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRedirect = async (_event: unknown) => {
    WebBrowser.dismissBrowser();
  };
  handleOAuthLogin = async () => {
    // gets the app's deep link
    const redirectUrl = (await Linking.getInitialURL()) as string;
    console.log("heyhey:", redirectUrl);
    // this should change depending on where the server is running
    const authUrl = `http://localhost:8080/auth/google`;
    this.addLinkingListener();
    try {
      const authResult = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );
      this.setState({ authResult: authResult });
    } catch (err) {
      console.log("ERROR:", err);
    }
    this.removeLinkingListener();
  };
  addLinkingListener = () => {
    Linking.addEventListener("url", this.handleRedirect);
  };
  removeLinkingListener = () => {
    Linking.removeEventListener("url", this.handleRedirect);
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
