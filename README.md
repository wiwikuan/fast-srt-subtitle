# Fast SRT Subtitle

This project is inspired by [wiwikuan/fast-srt-subtitle](https://github.com/wiwikuan/fast-srt-subtitle). See [this YouTube video](https://www.youtube.com/watch?v=Ath3BX9DBRs) for details.

## Demo

[Live Demo](https://srt.coderemixer.com)

## Deployment

The deployment script is descibed under `.github/workflows/deploy.yml`. If you have forked this project, you could easily deploy the project with GitHub Actions and GitHub Pages services by editing the custom domain:

```yml
- name: Setup Static Folder
  run: |
    echo "srt.coderemixer.com" > ./dist/CNAME
```

After editing the domain, activate the GitHub Pages in your repository settings, and it's all set.

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report
```

## Contribute Guide

TODO: CONTRIBUTE GUIDE

## LICENSE

This project is licensed under [GPLv3](https://github.com/dsh0416/fast-srt-subtitle/blob/master/LICENSE).

### Dependency License Scan

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdsh0416%2Ffast-srt-subtitle.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fdsh0416%2Ffast-srt-subtitle?ref=badge_large)
