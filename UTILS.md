# UTILS FILE

## Code Quality Analysis Github Workflow

* <https://github.com/code4romania/seismic-risc/tree/develop/.github/workflows>

## Generate requirements.txt file from Poetry

 $ poetry export -f requirements.txt --output requirements.txt

 Generate without hashes

 $ poetry export -f requirements.txt --output requirements.txt --without-hashes

## VSCODE Workspace Settings (.vscode)

```json
{
    "eslint.options": {
      "configFile": "/home/numan/Workspace/PERSONAL/PROJECTS/nim23/frontend/.eslintrc.json"
    }
}

```

## Linux Required Packages

build-essential libffi-dev libjpeg-dev libpq-dev


## Grabit Utils

### `bgutil-ytdlp-pot-provider`

Source: <https://github.com/Brainicism/bgutil-ytdlp-pot-provider>

```bash
docker run --name bgutil-provider -d -p 4416:4416 brainicism/bgutil-ytdlp-pot-provider
```

Using Native:

```bash
git clone --single-branch --branch 0.8.2 https://github.com/Brainicism/bgutil-ytdlp-pot-provider.git
cd bgutil-ytdlp-pot-provider/server/
yarn install --frozen-lockfile
npx tsc
node build/main.js
```
### Pytube Resources

- https://pytubefix.readthedocs.io/en/latest/user/auth.html
- https://pytube.io/en/latest/api.html
- https://github.com/pytube/pytube/issues/1894#issue-2180600881
- https://github.com/pytube/pytube/issues/1322
