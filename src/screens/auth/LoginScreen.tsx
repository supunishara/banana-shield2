import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList, RootStackParamList } from "../../types/navigation";
import { CompositeNavigationProp } from "@react-navigation/native";
import FormInput from "../../components/shared/CustomInput";
import { useForm } from "react-hook-form";
import CustomButton from "../../components/shared/CustomButton";
import { useFonts } from "expo-font";
import colors from "../../theme/colors";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { showMessage } from "react-native-flash-message";
import app from "../../../firebaseConfig";

type LoginScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, "Login">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

let width = Dimensions.get("window").width; //full width

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

type LoginData = {
  email: string;
  password: string;
};

const auth = getAuth(app);

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { control, handleSubmit, reset } = useForm<LoginData>();
  const [loading, setLoading] = useState(false);

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../../../assets/fonts/Poppins-Regular.ttf"),
  });

  const onSignInPressed = async ({ email, password }: LoginData) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      setLoading(false);
      navigation.navigate("Main");
      // Navigate to the next screen or perform other actions
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Error",
        description: `${error.message}`,
        type: "danger",
      });

      console.error("Login error:", error);
    }
  };

  const onRegisterPressed = () => {
    navigation.navigate("Register");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/blurred-login.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.root}>
          <FormInput
            name="email"
            placeholder="Email"
            secureTextEntry={true}
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
            }}
          />

          <FormInput
            name="password"
            placeholder="Password"
            secureTextEntry={false}
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password should be minimum 3 characters long",
              },
            }}
          />

          <CustomButton
            text={"Sign In"}
            onPress={handleSubmit(onSignInPressed)}
            loadingState={loading}
          />

          {/* <Text style={styles.registerPrimaryText}>
            Don't you have an account {` `}
            <Text
              style={styles.registerSecondaryText}
              onPress={onRegisterPressed}
            >
              Register here
            </Text>
          </Text> */}

          <Text style={styles.registerPrimaryText}>
            Don't you have an account {` `}
            <Text
              style={styles.registerSecondaryText}
              onPress={onRegisterPressed}
            >
              Register here
            </Text>
          </Text>

          {/* <Text style={styles.lowerText}>BANANA SHIELD</Text> */}

          <View
            style={{
              position: "absolute",
              bottom: 30,
              justifyContent: "center",
              alignItems: "center",
              width: width,
            }}
          >
            <Text style={styles.lowerText}>BANANA SHIELD</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1, // This ensures the ScrollView takes up all available space
  },
  container: {
    flex: 1,
  },
  textContainer: {},
  lowerText: {
    fontFamily: "Poppins-Bold",
    fontSize: 33,
    // position: "absolute",
    // bottom: 20,
    color: colors.textColor,
    // width: 300,
    // alignSelf: "center",
  },
  registerPrimaryText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.black,
    marginTop: 12,
  },

  registerSecondaryText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: colors.blue,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
