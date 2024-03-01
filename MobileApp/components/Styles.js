import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#f4511e",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 45,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderColor: "#f4511e",
    borderRadius: 15,
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
});
