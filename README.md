# South African ID Checker

This app scans a South African ID card to compute the checksum and its validity.
Made with Expo.

## Demo

https://github.com/user-attachments/assets/fb90a506-3302-49ef-817f-ef3257457e22

## Installation

These instructions will get you a copy of the project up and running on your local machine
for development and testing purposes.

1. To run this project, you'll need to have `Node.js` and `npm` installed on your machine.
   You can download Node.js and npm from the official website: https://nodejs.org

2. Clone the repository

```bash
$ git clone git@github.com:WillemW-01/id-check.git
```

3. Install dependencies

```bash
$ cd id-check
$ npm install
```

4. Start the development server (use one of the two).

```bash
$ npx expo start
$ npx expo start --tunnel
```

5. If using Expo Go, open Expo Go and select the running dev server. You are ready to use
   the application.

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
