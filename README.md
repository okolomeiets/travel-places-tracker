# Travel Places Tracker

Travel Places Tracker is a small Angular application for searching travel places by keyword and location, viewing place details, and saving favorite places to a wishlist.

The main focus of the project is on Angular fundamentals, clean project structure, Reactive Forms, TypeScript models, API integration, Angular signals, localStorage, simple caching, and user-friendly UI states.

> Note: This project requires a Geoapify API key for local usage.
> The API key is not included in the repository for security reasons.
> Please follow the **Environment Setup** section before running the app.

## Test Task Description

### Travel Places Tracker

Create a web application where users can build a list of places they would like to visit based on search results by keyword and location.
The application should use any public API, for example Foursquare Places API, to fetch information about popular tourist places.
Users should be able to:

- search for places by keyword and location
- add places to a wishlist
- view details about each place, such as rating, type, photos, tips, or reviews when available
- keep saved places after page reload using localStorage

The application should also implement simple caching to avoid repeated API requests for the same search within 10 minutes.

## Preview

The application was tested locally with a valid Geoapify API key.

### Search Results

![Search results](public/screenshots/search-results.png)

### Place Details

![Place details](public/screenshots/place-details.png)

### Wishlist

![Wishlist](public/screenshots/wishlist.png)

## Features

- Search places by keyword and location
- Fetch real place data from the Geoapify API
- Display search results as responsive place cards
- View additional place details when available
- View a static map preview on the details page
- Add and remove places from wishlist
- Persist wishlist in localStorage
- Cache search results for 10 minutes
- Handle loading and error states
- Display fallback values when API data is missing
- Responsive layout for desktop and mobile screens

## Tech Stack

- Angular
- TypeScript
- Angular Signals
- Reactive Forms
- Angular Router
- Angular HttpClient
- RxJS Observables
- SCSS
- Geoapify API
- localStorage
- Vitest

## API

This project uses the Geoapify API.

Geoapify is used for:

- geocoding a user-entered location
- searching places near the selected location
- loading additional place details when available
- generating a static map preview for the details page

The project is implemented as a frontend-only demo application.

## Implementation Note

Some data mentioned in the task, such as ratings, real photos, tips, and reviews, may not be available in the public Geoapify response. The application handles missing data gracefully and displays fallback values instead of showing incomplete or broken UI.

The search cache is based on both keyword and location. This prevents incorrect cached results when users search for different types of places in the same city, for example museums and cafes.

## API Limitations

Geoapify provides useful place information such as:

- place name
- address
- city and country
- categories
- coordinates
- place ID
- contact information when available
- opening hours when available
- additional details when available

However, Geoapify does not provide ratings, reviews, real photos, tips, or rich tourist content for every place.

Because of that, the application does not fake unavailable data. Instead, it shows available information and handles missing fields with clear fallback UI.

For a production application, API requests should usually be handled through a backend or proxy layer, especially when working with private API keys or stricter API providers.

## Environment Setup

This project uses the Geoapify API to search for places.

The API key is not included in the repository for security reasons.

To run the project locally, please create your own free Geoapify API key and add it to the environment file.

### How to get a Geoapify API key

1. Go to Geoapify [https://www.geoapify.com/](https://www.geoapify.com/)
2. Create a free account or log in.
3. Open the API keys section in your Geoapify dashboard.
4. Create or copy an API key.
5. Add it to the Angular environment file.

### Create environment file

Edite a file:

```txt
src/environments/environment.ts
```

Replace `YOUR_GEOAPIFY_API_KEY` with your real Geoapify API key.

```ts
export const environment = {
  production: false,
  apiKey: 'YOUR_GEOAPIFY_API_KEY',
};
```

## API Key Notice

This is a frontend-only demo application.

The API key is intentionally not committed to the repository.

Frontend API keys cannot be fully hidden in browser applications, so a production version should move API requests to a backend or proxy layer.

For local development, please use your own Geoapify API key.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/okolomeiets/travel-places-tracker.git
cd travel-places-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add Geoapify API key

Go to `src/environments/environment.ts` and add your Geoapify API key:

```ts
export const environment = {
  production: false,
  apiKey: 'YOUR_GEOAPIFY_API_KEY',
};
```

### 4. Run the project

```bash
npm start
```

The app will be available at:

```txt
http://localhost:4200
```

## Available Scripts

### Start development server

```bash
npm start
```

Runs the development server.

### Run tests

```bash
npm test
```

Runs unit tests.

### Build project

```bash
npm run build
```

Builds the project for production.

## Tests

The project includes unit tests for core logic and services, including:

- places API request creation
- cache saving and reading
- cache expiration after 10 minutes
- wishlist persistence in localStorage
- preventing duplicate wishlist items
- removing places from wishlist

Run tests with:

```bash
npm test
```

## Author

Created by Olha Kolomeiets.
