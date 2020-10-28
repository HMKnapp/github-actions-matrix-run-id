# github-actions-matrix-run-id
Fetches the current workflow run ID of a matrix job from the GitHub API

**Pull Requests welcome!**

## Setup
### Environment Variables

`MATRIX_ID` *required*

`GH_TOKEN` *conditional* PAT is required only for private repositories

### Example Workflow
Matrix
```
jobs:
  Runs:
    strategy:
      matrix:
        example_run: [run_one, run_two]
```
Pass Matrix job ID to environment
```
    steps:   
      - name: Build
        run: npm run build
        env:
          MATRIX_ID: ${{ matrix.example_run }}
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

## Usage
### Install

```
npm install 'HMKnapp/github-actions-matrix-run-id#master'
```

### Use via CLI
Output: Numeric run ID

```
node ./node_modules/github-actions-matrix-run-id/index.js
> 1234567890
```
Optional: Add parameter `--url` to get full URL
```
node ./node_modules/github-actions-matrix-run-id/index.js --url
> https://github.com/HMKnapp/github-actions-matrix-run-id/runs/1234567890
```

### Use as Module
Example
```js
const { getRunID } = require("github-actions-matrix-run-id");

async function printID() {
  const id = await getRunID();
  console.log(id);
}

printID();
```
## Known Limitations
Issues getting ID for Pull Request runs
