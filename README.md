# Workflow Checks Action

Run workflow checks & validations.

## Inputs

### `type`

**Required** Type of the workflow. Default `"byoc"`.

### `checkCode`

**Required** Check Code.

### `oasFilePath`

OpenAPI spec file path.

## Example usage

```yaml
uses: choreo-templates/workflow-checks@v1
with:
  type: 'byoc'
  checkCode: CH_1
  oasFilePath: ${{github.event.inputs.oasFilePath}}
```