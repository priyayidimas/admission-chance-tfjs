import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

import Dataset from "./dataSet";

const trainTestSplit = require('train-test-split');
const dataset = new Dataset();

function data() {  

    function prepareData(data) {
  
        return tf.tidy(() => {
            tf.util.shuffle(data);

            const input = data.map(d => [d.GREScore, d.TOEFLScore, d.UnivRating, d.SOP, d.LOR, d.CGPA, d.RES]);
            const output = data.map(d => d.AdmChance) || [0];

            const inputTensor = tf.tensor2d(input, [input.length, input[0].length]);    
            const outputTensor = tf.tensor2d(output,[output.length,1]);
        
            return {
                inputs: inputTensor,
                outputs: outputTensor,
            }
        });  
    }

    function displayData(container,container2, data){
        let display1 = data.map(d => ({
            x: d.UnivRating,
            y: d.AdmChance,
        }));
        let display2 = data.map(d => ({
            x: d.RES,
            y: d.AdmChance,
        }));
        let display3 = data.map(d => ({
            x: d.SOP,
            y: d.AdmChance,
        }));
        const display4 = data.map(d => ({
            x: d.LOR,
            y: d.AdmChance,
        }));
        let series = ['UnivRating', 'RES','SOP','LOR'];
        tfvis.render.scatterplot(
            container,
            {values: [display1,display2,display3,display4], series}
        );

        display1 = data.map(d => ({
            x: d.CGPA,
            y: d.AdmChance,
        }));
        display2 = data.map(d => ({
            x: d.GREScore,
            y: d.AdmChance,
        }));
        display3 = data.map(d => ({
            x: d.TOEFLScore,
            y: d.AdmChance,
        }));
        series = ['CGPA','GRESCore', 'TOEFLScore'];
        tfvis.render.scatterplot(
            container2,
            {values: [display1,display2,display3], series}
        );
    }

    function createModel(length) {
        const model = tf.sequential(); 
        model.add(tf.layers.dense({inputShape: [length], units: 100,  activation: 'relu'}));
        model.add(tf.layers.dense({units: 100, activation: 'relu'}));
        model.add(tf.layers.dense({units: 1}));
      
        model.compile({
            optimizer: tf.train.adam(),
            loss: 'meanSquaredError',
            metrics: ['mae','mse'],
        });
        return model;
    }

    async function trainModel(model, inputs, outputs, epochs, container) {        
        const batchSize = 32;

        return await model.fit(inputs, outputs, {
            batchSize,
            epochs,
            shuffle: true,
            callbacks: tfvis.show.fitCallbacks(
                container,
                ['mse', 'mae'], 
                { height: 200, callbacks: ['onEpochEnd'] }
            )
        });
    }

    async function evaluateModel(model, inputs, outputs, container){
        const result = await model.evaluate(inputs, outputs, {batchSize: 32});
        container.innerHTML = `
            <p>MAE : ${result[1]}</p>
            <p>MSE : ${result[2]}</p>
        `;
        
    }


    document.addEventListener("DOMContentLoaded", async () => {
        //Init
        await dataset.loadData();
        const model = createModel(dataset.numFeatures);
        //Containers
        const sct_container = document.querySelector("#sct-container");
        const sct_container2 = document.querySelector("#sct-container2");
        const model_container = document.querySelector("#model-container");
        const train_container = document.querySelector("#train-container");
        const eval_container = document.querySelector("#eval-container");
        //Data Split
        const [train, test] = trainTestSplit(dataset.data,0.8,0);
        const {inputs: trainInput, outputs: trainOutput} = prepareData(train);
        const {inputs: testInput, outputs: testOutput} = prepareData(test);
        
        //Data Visualization
        displayData(sct_container,sct_container2, dataset.data);
        //Model Summary
        tfvis.show.modelSummary(model_container,model);
        model_container.classList.add("table-responsive");
        //Data Training
        document.querySelector("#trainButton").addEventListener("click", async function () {
            await trainModel(model,trainInput,trainOutput,10,train_container);
            document.querySelector("#evalButton").style.display = "block";
            document.querySelector("#prediction").style.display = "block";
        });
        //Data Evaluation
        document.querySelector("#evalButton").addEventListener("click", async function () {
            await evaluateModel(model,testInput,testOutput,eval_container);
        });
        //Data Prediction
        document.querySelector("#predButton").addEventListener("click", async function () {
            const predGREScore = parseInt(document.querySelector("#predGREScore").value);
            const predTOEFLScore = parseInt(document.querySelector("#predTOEFLScore").value);
            const predUnivRating = parseFloat(document.querySelector("#predUnivRating").value);
            const predSOP = parseFloat(document.querySelector("#predSOP").value);
            const predLOR = parseFloat(document.querySelector("#predLOR").value);
            const predCGPA = parseFloat(document.querySelector("#predCGPA").value);
            const predRES = parseInt(document.querySelector("#predRES").value);

            const arrData = [predGREScore,predTOEFLScore,predUnivRating,predSOP,predLOR,predCGPA,predRES];
            const predictTensor = tf.tensor2d(arrData, [1, 7]);

            document.querySelector("#predAdmChance").innerHTML = model.predict(predictTensor);
        });

    },false);
}
export default data;