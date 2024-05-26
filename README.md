# South African ID Checker

This app scans a South African ID card to compute the checksum and its validity.
Made with Expo.

## Installation

1. Clone the project

   ```bash
   $ git clone git@github.com:WillemW-01/id-check.git
   ```

1. Install dependencies

   ```bash
   npm install
   ```

1. Start the app

   ```bash
    npx expo start --tunnel
   ```

1. If using Expo Go, open it on your device and open the development server,
   otherwise run the app on your preferred method (see below).

There are different ways of using an app made by Expo:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app
  development with Expo

## Background

In South Africa, it’s common for teenagers to manipulate the digits in their ID
numbers to gain entry to clubs and other 18+ establishments.

However, many are unaware that the last digit in a South African ID serves as a
checksum. This checksum digit helps detect any alterations to the preceding
digits.

Our application performs precisely this function: it recalculates the checksum
and compares it with the ID number. The primary goal of this application is to
offer relevant businesses in South Africa an added layer of security. By
preventing underage teenagers from accessing alcohol, it helps safeguard their
liquor licenses.
