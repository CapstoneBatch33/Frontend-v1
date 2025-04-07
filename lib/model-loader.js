'use client';

let tf;
let model = null;

const diseaseClasses = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
];

async function initTF() {
  if (!tf) {
    tf = await import('@tensorflow/tfjs');
    await tf.ready();
  }
  return tf;
}

export async function loadModel() {
  await initTF();
  
  if (model) return model;
  
  console.log('Loading model...');
  
  try {
    // First create a sequential model
    const sequential = tf.sequential();
    
    // Add an input layer with the correct shape
    sequential.add(tf.layers.inputLayer({
      inputShape: [224, 224, 3],
      batchSize: null,
      dtype: 'float32',
      name: 'input_1'
    }));
    
    // Use raw GitHub content URL instead of repository browser URL
    const loadedModel = await tf.loadLayersModel('https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/sqftToPropertyPrice/model.json');
    console.log('Loaded model:', loadedModel.summary());
    
    // Copy the layers from the loaded model (skipping the input layer)
    for (let i = 1; i < loadedModel.layers.length; i++) {
      sequential.add(loadedModel.layers[i]);
    }
    
    // Compile the model
    sequential.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    model = sequential;
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

  try {
    // Convert image to tensor
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    // Normalize the image
    const normalized = tensor.div(255.0);

    // Run prediction
    const predictions = await model.predict(normalized).data();
    
    // Cleanup
    tensor.dispose();
    normalized.dispose();

    // Get the highest probability class
    const maxProbability = Math.max(...predictions);
    const predictedClassIndex = predictions.indexOf(maxProbability);
    
    return {
      class: diseaseClasses[predictedClassIndex],
      confidence: maxProbability
    };
  } catch (error) {
    console.error('Error during image classification:', error);
    throw error;
  }
}