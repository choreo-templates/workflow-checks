const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec').exec;
const path = require('path');

const CheckCodes = {
    DOCKER_FILE_SCAN: "CH_1",
    TRIVY_SCAN: "CH_2",
    VALIDATE_OPENAPI: "CH_3"
}
const DOCKER_FILE_PATH = process.env.DOCKER_FILE_PATH;
const SCAN_RESULT_DIR = process.env.SCAN_RESULT_DIR;
const DOCKER_IMAGE = process.env.DOCKER_TEMP_IMAGE;
const OAS_VADATION_REPORT_GITOPS_FILE_NAME = process.env.OAS_VADATION_REPORT_GITOPS_FILE_NAME;

async function run() {
    try {
        // const workflowType = core.getInput('type', { required: true });
        const checkCode = core.getInput('checkCode', { required: true });
        switch (checkCode) {
            case CheckCodes.DOCKER_FILE_SCAN:
                await exec(`checkov -f ${DOCKER_FILE_PATH} --framework dockerfile --check CKV_DOCKER_3,CKV_DOCKER_8,CKV_CHOREO_1 -o json --quiet --external-checks-dir ../../../../../custom-checkov-policy --output-file-path ${SCAN_RESULT_DIR}`);
                break;
            case CheckCodes.TRIVY_SCAN:
                await exec(`trivy image --format=table --severity=CRITICAL --output=${SCAN_RESULT_DIR}/trivyScanResult --exit-code=1 --ignore-unfixed=true ${DOCKER_IMAGE}`);
                break;
            case CheckCodes.VALIDATE_OPENAPI:
                const oasFilePath = core.getInput('oasFilePath', { required: true });
                await exec(`rm -rf ${SCAN_RESULT_DIR}/${OAS_VADATION_REPORT_GITOPS_FILE_NAME} && touch ${SCAN_RESULT_DIR}/${OAS_VADATION_REPORT_GITOPS_FILE_NAME}`);
                await exec(`swagger-cli validate ${oasFilePath} &> ${SCAN_RESULT_DIR}/${OAS_VADATION_REPORT_GITOPS_FILE_NAME}`);
                await exec(`swagger-cli bundle ${oasFilePath} --outfile ${GITOPS_CLONE}/${OAS_GITOPS_FILE_NAME}`);
                break;
            default:
                break;
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run().catch(core.setFailed);