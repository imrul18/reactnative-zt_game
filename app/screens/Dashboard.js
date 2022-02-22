import { React, useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = () => {
  const [Status, setStatus] = useState("running");

  const [Max, setMax] = useState("Max");
  const [Min, setMin] = useState("Min");
  const [Center, setCenter] = useState("Center");

  const [Level, setLevel] = useState(2);
  const [Left, setLeft] = useState();
  const [LeftCount, setLeftCount] = useState(2);
  const [Right, setRight] = useState();
  const [RightCount, setRightCount] = useState(2);
  const [Final, setFinal] = useState(10);

  const createAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const gameStart = (type) => {
    var x = Math.floor(Math.random() * 18 - 9);
    while (x == 0) {
      x = Math.floor(Math.random() * 18 - 9);
    }
    setLeft(parseInt(x));
    x = Math.floor(Math.random() * 18 - 9);
    while (x == 0) {
      x = Math.floor(Math.random() * 18 - 9);
    }
    setRight(parseInt(x));
    setFinal(10);

    if (type == "Complete") {
      setLevel(parseInt(Level + 1));
      setLeftCount(parseInt(Level + 1));
      setRightCount(parseInt(Level + 1));
    }
    if (type == "GameOver") {
      setLeftCount(parseInt(Level));
      setRightCount(parseInt(Level));
    }

    setMax("Max");
    setMin("Min");
    setCenter("Center");
  };
  const storage = async () => {
    try {
      AsyncStorage.getItem("storelevel").then((value) => {
        if (value != null) {
          setLevel(parseInt(value) + 1);
          setLeftCount(parseInt(value) + 1);
          setRightCount(parseInt(value) + 1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    storage();
    gameStart("start");
  }, []);

  const usepower = (type) => {
    if (type == "max" && Max == "Max") {
      setMax("Empty");
      var x = 20;
      setFinal(parseInt(x));
    } else if (type == "center" && Center == "Center") {
      setCenter("Empty");
      var x = 10;
      setFinal(parseInt(x));
    } else if (type == "min" && Min == "Min") {
      setMin("Empty");
      var x = 1;
      setFinal(parseInt(x));
    } else createAlert("Already Used", "You already use this card!!");
  };

  const callOver = () => {
    createAlert("GameOver", "You loss the game");
    setStatus("GameOver");
    gameStart("GameOver");
    console.log("GameOver");
  };

  const complete = async () => {
    createAlert("Comgratulations", "You have complete the level!!!");
    setStatus("Complete");
    gameStart("Complete");
    try {
      await AsyncStorage.setItem("storelevel", Level.toString());
      toString(Level);
    } catch (error) {
      console.log(error);
    }
  };

  const clickLeft = () => {
    if (LeftCount > 0) {
      var x = Math.floor(Math.random() * 18 - 9);
      while (x == 0) {
        x = Math.floor(Math.random() * 18 - 9);
      }
      setLeft(parseInt(x));
      x = Final + Left;
      if (x > 20 || x < 1) callOver();
      else {
        setFinal(parseInt(x));
        setLeftCount(LeftCount - 1);
      }
      if (LeftCount == 1) setLeft("$");
      if (RightCount == 0 && LeftCount == 1) {
        complete();
      }
    } else {
      createAlert("Empty Card", "No card available to use!!!");
      setLeft("$");
    }
  };

  const clickRight = () => {
    if (RightCount > 0) {
      var x = Math.floor(Math.random() * 18 - 9);
      while (x == 0) {
        x = Math.floor(Math.random() * 18 - 9);
      }
      setRight(parseInt(x));
      x = Final + Right;
      if (x > 20 || x < 1) callOver();
      else {
        setFinal(parseInt(x));
        setRightCount(RightCount - 1);
      }
      if (RightCount == 1) setRight("$");
      if (RightCount == 1 && LeftCount == 0) {
        complete();
      }
    } else {
      createAlert("Empty Card", "No card available to use!!!");
      setRight("$");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.level}>
        <Text style={styles.leveltxt}>Level: {Level}</Text>
      </View>
      <View style={styles.colpart}>
        <TouchableOpacity style={styles.viewpart} onPress={clickLeft}>
          <Text style={styles.textpart}>{Left}</Text>
          <Text style={styles.countpart}>{LeftCount}</Text>
        </TouchableOpacity>

        <View style={styles.viewpart}>
          <Text style={styles.textpart}>{Final}</Text>
          <Text style={styles.countpart}> </Text>
        </View>
        <TouchableOpacity style={styles.viewpart} onPress={clickRight}>
          <Text style={styles.textpart}>{Right}</Text>
          <Text style={styles.countpart}>{RightCount}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.colpart}>
        <TouchableOpacity
          style={styles.viewpart}
          onPress={() => usepower("max")}
        >
          <Text style={styles.powertextpart}>{Max}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewpart}
          onPress={() => usepower("center")}
        >
          <Text style={styles.powertextpart}>{Center}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewpart}
          onPress={() => usepower("min")}
        >
          <Text style={styles.powertextpart}>{Min}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  colpart: {
    flex: 1,
    backgroundColor: "#eaeaea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewpart: {
    height: 200,
    margin: 5,
    backgroundColor: "#aaefea",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  textpart: {
    fontSize: 80,
    color: "red",
  },
  countpart: {
    fontSize: 30,
    color: "red",
  },
  powertextpart: {
    fontSize: 30,
    color: "red",
    transform: [{ rotateX: "0deg" }, { rotateZ: "0deg" }],
  },
  level: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 40,
  },
  leveltxt: {
    fontSize: 40,
    color: "red",
  },
});

export default Dashboard;
