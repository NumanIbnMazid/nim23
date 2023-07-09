# UTILS FILE

## Code Quality Analysis Github Workflow

* <https://github.com/code4romania/seismic-risc/tree/develop/.github/workflows>

## Generate requirements.txt file from Poetry

 $ poetry export -f requirements.txt --output requirements.txt

 Generate without hashes

 $ poetry export -f requirements.txt --output requirements.txt --without-hashes

## Demo User Authentication Token for Development

```json
{
  "expiry": "2023-07-05T03:53:01.757821Z",
  "token": "c012a83914869d906fc34e514d1c101e9175c652975f48372e731d72091c9bd3",
  "user": {
    "email": "admin@admin.com"
  }
}
```

Usage:
Token 9ae5f0396f6b504f493e51f5c9bc77b80812cddad973f0b27e7de50ae70f83fa
