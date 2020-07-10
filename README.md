# AWS Systems Manager emulator

Available on Docker Hub as [eriveltonfacundo/aws-ssm-emulator](https://hub.docker.com/r/eriveltonfacundo/aws-ssm-emulator).

At the moment, an extremely minimal emulator of [AWS Systems Manager](https://aws.amazon.com/systems-manager/).

Supported AWS Systems Manager features:
- [GetParameter](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_GetParameter.html)

Limitations:
- it ignores secret versions
- it ignores decryption
- it ignores authentication
- it provides an almost entirely hardcoded ARN

## Configuration

Configuration is done through environment variables.

- `SSM_PORT` the port to run on - **default is 4583**
- `SSM_PRELOAD_DIRECTORY` absolute path of directory from which to read initial set of parameters (see below) - **default is empty**
- `SSM_PARAMS` parameters to preload if you are unable to use volume mounts - **default is empty**

## Preloading parameters

Preloading parameters can be done either via files or by passing a Value string through an environment variable.

### Via files

`.env` becomes a parameters with `Name=Value` and value string is the content of the file.

### Via environment variable

You can provide a set of initial parameters by setting the environment variable `SSM_PARAMS`.

It is basically a dictionary with a **string key** and a **string value**. The key becomes the Name and the Value becomes the content.

In Bash the above would look like this:

```bash
SET SSM_PARAMS='test1=value1,test2=test2'
```

## Usage

### docker-compose.yml

```yaml
version: '3'
services:
  ssm:
    image: eriveltonfacundo/aws-ssm-emulator:0.1.0 ## remember to update the version
    volumes:
      - ./parameters:/parameters ## preload parameters via files
    ports:
      - 4583:4583
```
