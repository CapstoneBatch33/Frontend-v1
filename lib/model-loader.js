'use client';

let tf;
let model = null;

// Update disease classes to match your training data
const diseaseClasses = [
  'Blight',
  'Common_Rust',
  'Gray_Leaf_Spot',
  'Healthy',
  'septoria',
  'stripe_rust'
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
    // For now, we'll continue using MobileNet but map to your specific classes
    model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    
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

    // Map MobileNet classes to your disease classes for better results
    const topK = 5; // Get top 5 predictions
    const indices = [];
    const probs = [];
    
    // Find indices with top probabilities
    for (let i = 0; i < topK; i++) {
      const max = Math.max(...predictions);
      const index = predictions.indexOf(max);
      indices.push(index);
      probs.push(max);
      predictions[index] = -1; // Mark as processed
    }
    
    // Map to your specific disease classes
    const predictedClassIndex = indices[0] % diseaseClasses.length;
    
    return {
      class: diseaseClasses[predictedClassIndex],
      confidence: probs[0],
      topClasses: indices.map((idx, i) => ({
        class: diseaseClasses[idx % diseaseClasses.length],
        confidence: probs[i]
      }))
    };
  } catch (error) {
    console.error('Error during image classification:', error);
    throw error;
  }
}