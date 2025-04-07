'use client';

// Dynamic import for TensorFlow.js to avoid server-side loading issues
let tf;

// Disease classes that your model can predict
const diseaseClasses = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  // Add all your disease classes here
];

let model = null;

// Initialize TensorFlow.js
async function initTF() {
  if (!tf) {
    tf = await import('@tensorflow/tfjs');
    await tf.ready();
    console.log('TensorFlow.js initialized');
  }
  return tf;
}

export async function loadModel() {
  await initTF();
  
  if (model) return model;
  
  try {
    // Load the model from the .h5 file
    // Note: You'll need to convert your .h5 file to tfjs format
    model = await tf.loadLayersModel('/models/plant_disease_model/model.json');
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

export async function classifyImage(imageElement) {
  await initTF();
  
  if (!model) {
    model = await loadModel();
  }

  // Preprocess the image to match the model's expected input
  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224]) // Resize to model input size
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  // Run prediction
  const predictions = await model.predict(tensor).data();
  
  // Clean up tensor to prevent memory leaks
  tensor.dispose();

  // Get the index with highest probability
  const maxProbability = Math.max(...predictions);
  const predictedClassIndex = predictions.indexOf(maxProbability);
  
  return {
    class: diseaseClasses[predictedClassIndex],
    confidence: maxProbability
  };
}