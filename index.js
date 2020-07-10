const { SSM_PORT, AWS_REGION, SSM_PRELOAD_DIRECTORY, SSM_PARAMS } = process.env;

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/x-amz-json-1.1' }));

const parameters = [];
fromEnvironment();
fromDirectory();

app.post('/', (req, res) => {
    if ((req.headers['x-amz-target'] || '').toLowerCase() === 'amazonssm.getparameter') {
        return res.json(parameters[req.body.Name]);
    }
    return res.sendStatus(404);
});

app.listen(SSM_PORT, () => console.log(`App running on port ${SSM_PORT}.`));

function fromEnvironment() {
    if (SSM_PARAMS) {
        SSM_PARAMS.split(',').forEach((param) => {
            const [name, value] = param.split('=');
            parameters[name] = createParamResult(name, value);
        });
    }
}

function fromDirectory() {
    if (SSM_PRELOAD_DIRECTORY && fs.existsSync(SSM_PRELOAD_DIRECTORY)) {
        fs.readdirSync(SSM_PRELOAD_DIRECTORY).forEach((f) => {
            fs.readFileSync(Path.join(SSM_PRELOAD_DIRECTORY, f), 'utf-8')
                .split(/\r?\n/)
                .forEach((param) => {
                    const [name, value] = param.split('=');
                    parameters[name] = createParamResult(name, value);
                });
        });
    }
}

function createParamResult(name, value) {
    return {
        Parameter: {
            Name: name,
            Type: 'String',
            Value: value,
            Version: 1,
            LastModifiedDate: new Date().toISOString(),
            ARN: `arn:aws:ssm:${AWS_REGION}:123456789012:document/${name}`,
        },
    };
}
