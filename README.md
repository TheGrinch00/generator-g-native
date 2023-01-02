# React Native CLI Tool Generator

Welcome to this tool useful to avoid boilerplate code in your React Native experience created using Node 18. This tool will set you up with a project scaffolding in typescript, a basic navigation (using the `tabs` template) and some useful setup for AJAX calls, redux toolkit and form utilities.

## Installation

To install and use it from your machine make sure to have `yeoman` installed: <br /> `npm i -g yo` <br /> <br />
After installing yeoman, run the following command: <br />

`npm i -g generator-g-native` <br />
`yo --generators` <br />

And you should see the generator popping up in the list.  <br />

# Commands

This is a list of the available commands:

## yo g-native:app

Creates the React Native app and uses the `tabs` typescript template

## yo g-native:init

Adds useful files and folders, adds dependencies and installs them

## yo g-native:comp

Creates a new component inside the `src/components` folder

## yo g-native:slice

Creates a new redux slice inside the `src/redux-store` folder with all the boilerplate code already in place and ready to use

## yo g-native:ajax

Creates a redux action that will trigger an AJAX call to the specified endpoint

## yo g-native:form

Creates a new component with all boilerplate code to create a form with `react-hook-form` and validations via `yup`

## yo g-native:model

Creates a new TypeScript class representing a data model inside the `src/models` folder

## yo g-native:screen

Creates a new component inside the `src/screens` folder