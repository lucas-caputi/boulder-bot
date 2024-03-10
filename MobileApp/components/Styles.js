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
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 15,
    color: "black",
  },
  buttonsContainer: {
    borderColor: "#f4511e",
    borderRadius: 15,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: -30,
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    textAlign: "center",
    width: 300,
    top: 30,
  },
});
