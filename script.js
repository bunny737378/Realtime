const HUGGINGFACE_API_KEY = "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";
const MODEL_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
let typingTimer;

async function generateImage(prompt) {
    const width = document.getElementById("widthInput").value || 512;
    const height = document.getElementById("heightInput").value || 512;
    const imageContainer = document.getElementById("imageContainer");

    if (!prompt) {
        imageContainer.innerHTML = "<p>Start typing to generate an image...</p>";
        return;
    }

    imageContainer.innerHTML = "<p>Generating image...</p>";

    // Generate random seed for different images every time
    const randomSeed = Math.floor(Math.random() * 100000);

    // Fetch API Call
    const response = await fetch(MODEL_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            inputs: prompt, 
            parameters: { 
                width: parseInt(width), 
                height: parseInt(height), 
                seed: randomSeed  // Ensures different images for same prompt
            }
        })
    });

    if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        imageContainer.innerHTML = `<img src="${imageUrl}" id="generatedImage"/>`;
    } else {
        imageContainer.innerHTML = "<p>❌ Error: Could not generate image. Try again.</p>";
    }
}

// Event Listener for Real-Time Typing
function handleInput() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const prompt = document.getElementById("promptInput").value;
        generateImage(prompt);
    }, 1000); // 1-second delay after typing stops
}