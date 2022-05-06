# React Native Boilerplate

[![GitHub version](https://img.shields.io/github/package-json/v/chrisleekr/react-native-boilerplate)](https://github.com/chrisleekr/react-native-boilerplate/releases)
[![Build](https://github.com/chrisleekr/react-native-boilerplate/workflows/Push/badge.svg)](https://github.com/chrisleekr/react-native-boilerplate/actions?query=workflow%3APush)
[![CodeCov](https://codecov.io/gh/chrisleekr/react-native-boilerplate/branch/main/graph/badge.svg)](https://codecov.io/gh/chrisleekr/react-native-boilerplate)
[![MIT License](https://img.shields.io/github/license/chrisleekr/react-native-boilerplate)](https://github.com/chrisleekr/react-native-boilerplate/blob/main/LICENSE)

> A React Native boilerplate using React Native, React Navigation, React Redux Toolkit, React Native Bootsplash, React Native Onboarding Swiper, Redux Persist, Formik, Yup, Lottie, Axios

This is a React Native boilerplate project.

The project is using Node.js REST API that I developed as the boilerplate. [You can find the Node.js REST API boilerplate project in here.](https://github.com/chrisleekr/nodejs-vuejs-mysql-boilerplate)

The REST API is currently hosted in [https://nvm-boilerplate.chrislee.kr/api](https://nvm-boilerplate.chrislee.kr/api).

## Demo

https://user-images.githubusercontent.com/5715919/166450457-04eaab8b-5d21-43ea-b40c-7dc61589503a.mp4

## Features

- Nested React Native navigations: Drawer + Tab + Stack navigations
- Automated CI/Release package files with Gitlab CI/Github CI
- Unit test 100% coverage
- JWT authentication flow with auto refresh
- Branch/Commit naming conventions
- Form validation with Yup and Formik
- User flows: Register/Login/Forgot Password/My Account/Todo/Settings/Simple pages

## How to run in your local

### Android

```bash
# Clone the repository
git clone https://github.com/chrisleekr/react-native-boilerplate

# Install dependencies
npm install

# Start Metro
npm start

# Run Android
npm run android
```

### iOS

```bash
# Clone the repository
git clone https://github.com/chrisleekr/react-native-boilerplate

# Install dependencies
npm install

# Start Metro
npm start

# Pod install
cd pod; pod install; cd ..

# Run iOS
npm run ios
```


## How to rename the project to use for your project

You can use [react-native-rename](https://www.npmjs.com/package/react-native-rename) to start your own project!

```bash
# Clone the repository
git clone https://github.com/chrisleekr/react-native-boilerplate

# Rename project
$ $ npx react-native-rename "Travel App" -b com.junedomingo.travelapp
```

## Todo

- [ ] Optimise with wdyr
- [ ] Add iOS build to Github actions
- [ ] Add E2E tests
- [ ] Add push notification
- [ ] Add React Native Biometrics
