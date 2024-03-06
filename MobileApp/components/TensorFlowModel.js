import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as FileSystem from 'expo-file-system';
import * as tf from '@tensorflow/tfjs';

// Mobilenet model
export const classifyUsingMobilenet = async (imageUri, setIsTfReady, setResult) => {
  try {
    // Load mobilenet
    await tf.ready();
    const model = await mobilenet.load();
    setIsTfReady(true);
    console.log("starting inference with picked image: " + imageUri)

    // Convert image to tensor
    const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer)
    const imageTensor = decodeJpeg(raw);
    // Classify the tensor and show the result
    const prediction = await model.classify(imageTensor);
    if (prediction && prediction.length > 0) {
      setResult(
        prediction[0].className + " (" + prediction[0].probability.toFixed(3) + ")"
      );
    }
  } catch (err) {
    console.log(err);
  }
};
