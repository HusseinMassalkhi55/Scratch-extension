const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');
const fetch = require('node-fetch');

class Scratch3YourExtension {

    constructor (runtime) {
        this.apiKey = 'acc_915f79d5ee57c37';
        this.apiSecret = '9e78e45c5aec06c69fbf00c85a748102';
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo () {
        return {
            // unique ID for your extension
            id: 'yourScratchExtension',

            // name displayed in the Scratch UI
            name: 'Demo',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // your Scratch blocks
            blocks: [
                {
                    // function where your code logic lives
                    opcode: 'classifyImage',

                    // type of block
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: 'Classify image [IMAGE_URL]',

                    // arguments used in the block
                    arguments: {
                        IMAGE_URL: {
                            defaultValue: 'https://example.com/image.jpg',
                            type: ArgumentType.STRING
                        }
                    }
                }
            ]
        };
    }

    /**
     * implementation of the block to classify an image
     */
    classifyImage ({ IMAGE_URL }) {
        const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(IMAGE_URL)}`;
        const headers = {
            'Authorization': 'Basic ' + Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')
        };

        return fetch(url, { headers })
            .then(response => response.json())
            .then(data => {
                if (data.result && data.result.tags && data.result.tags.length > 0) {
                    const tag = data.result.tags[0];
                    return `${tag.tag.en} (${(tag.confidence).toFixed(2)}%)`;
                } else {
                    return 'No tags found';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return 'Error occurred';
            });
    }
}

module.exports = Scratch3YourExtension;
