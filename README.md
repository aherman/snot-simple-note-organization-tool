# snot-simple-note-organization-tool
## Overview
S.N.O.T. (Simple Note Organization Tool) is an online idea organization and bookmarking app built on the Google Apps Script platform.

Live site (requires Google account): [SNOT (Simple Note Organization Tool) App](https://script.google.com/macros/s/AKfycbwEab9cZvlkZv7lJW3ycPdDskwYTjM-7MAONoVHF0uIqeyh7oQ/exec)

## Bookmarking Bookmarklet

SNOT comes with a [del.icio.us](https://del.icio.us/)'esque bookmarking bookmarklet that will auto-fill the URL and title of the current site.
Steps for using:
1. Create a new bookmark in your browser.
2. Edit the bookmark and copy+paste the code in __bookmarklet.js__ into the URL field.
3. When you're on a site, click the bookmark to bring up the SNOT app.

## Background & Purpose
This project started with the desire to organize my myriad ideas, notes and bookmarks in one single user-friendly place.

I had some additional technical goals:

 * Practice building a Javascript-based web application
 * Test out the Google Apps Script platform

 (Contact me to hear about the challenges and platform quirks I ran into!)

 ## Technical Details

* Application server: Google Apps Script
* Database server: Google Fusion Tables
* Front-end languages used: Javascript, HTML, CSS
* Back-end languages used: Javascript
* Frameworks/libraries used: jQuery, Datatables, Bootstrap

## Application Architecture and Filesystem

The application is divided into two categories based on the Google Apps Script platform - javascript (.gs) server files and HTML (HTML, CSS, Javascript) browser files. Apps Script only allows .gs and .html file types, so all front-end CSS and Javascript have to be saved as .html files. By convention, I appended __CSS_ or __JS_ to the names of browser files that are not actually HTML code.

Also note that in the actual Apps Script environment (https://script.google.com), folders are not (currently) supported, so every file is actually stored at the same level. I just separated it in this repo for better accessibility.

When the application URL is accessed, code execution starts in the server file appMain.gs, with the function _doGet_. This is the special function Google Apps Script calls to initiate the app UI. In SNOT, doGet processes the URL, loads some session data, and then renders the mainView HTML template. This in turn loads the rest of the code and executes the front-end app.

## Design and Interface

The SNOT datamodel contains a list/set of notes that are mapped to Tags in a many-to-many relationship, i.e. a note can have many tags and a tag can be associated with many notes. This provides a simple and flexible system for many use cases.

### Notes View
A filterable list of all notes.

![Screenshot of Notes View](https://cloud.githubusercontent.com/assets/1609988/25728857/5548cd7e-30f7-11e7-928f-868d51f9f4fb.png)

### Note View
Edit view of a single note.

![Screenshot of Note View](https://cloud.githubusercontent.com/assets/1609988/25729206/7e1d709a-30f9-11e7-90ff-32f901f4f70d.png)

### Tags View
A filterable list of all tags.

![Screenshot of Tags View](https://cloud.githubusercontent.com/assets/1609988/25729215/8bd8c81a-30f9-11e7-9e44-45c9e83a51d5.png)

### Tag View
Edit view of a single tag.

![Screenshot of Tag View](https://cloud.githubusercontent.com/assets/1609988/25729210/8376ca6e-30f9-11e7-8136-6f69a4d3f0a0.png)

## Status and Future

Since this project is mostly for personal use and learning, it is mostly a proof-of-concept and is currently not scalable to a larger user-base. It also needs some refactoring to make it more flexible and resilient.

Issues

* Improve database layer (scalability, resiliency)
* Apply front-end application framework
