# Project Exam 2, second year at Noroff.

## Holidaze website.
Link to Holidaze: https://holidaze-pe2-renayoo.netlify.app/


Home page for Holidaze. 


# Holidaze – Venue Booking Web App

This is my Project Exam 2 submission. 
Holidaze is a modern, tropical-themed booking platform where users can search for, view, and book holiday venues. Venue Managers can register, create their own listings, and monitor upcoming bookings. This app was built using React and Tailwind CSS and integrates fully with Noroff's Holidaze API (v2).

This website uses API: https://docs.noroff.dev/docs/v2/holidaze/venues

## 🌟 Features

- **Search & Filtering**  
  Search venues by title, city, or country. Sort by price (low-high or high-low) or newest listings.

- **Venue Details**  
  Each venue includes images, description, amenities, and availability through a responsive calendar.

- **Booking System**  
  Logged-in users can book venues, select valid dates (unavailable dates are greyed out), and see their upcoming bookings.

- **User Profile**  
  Update your avatar, bio, and banner. See your bookings and venues in a personalized dashboard.

- **Venue Manager**  
  Register as a Venue Manager to create venues, edit listings, and view all future bookings made on your venues.

- **Carousel Display**  
  Dynamic hero carousel highlighting selected venues.

- **Fully Responsive**  
  Optimized for mobile, tablet, and desktop.

---


## Tech Stack

- **React**
- **Tailwind CSS**
- **React Router**
- **React Datepicker**
- **Noroff Holidaze API v2**

---

## Figma style guide
- [Figma](https://www.figma.com/design/girV7fgXWkbJfdhw9sQMwH/Untitled?node-id=27-1183&t=jwXlJnOOhIgFGmJ9-0)


## Getting Started

### Installing

1. Clone the repo:

```bash
git clone https://github.com/renayoo/Holidaze-PE2-renayoo.git

```
### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

---
## API Integration

This project uses [Noroff Holidaze API v2](https://docs.noroff.dev/holidaze/) with key endpoints such as:

- `GET /venues`
- `GET /venues/:id?_bookings=true`
- `GET /bookings?_venue=true`
- `GET /profiles/:name?_venues=true&_bookings=true`
- `PUT /profiles/:name`
- `POST /bookings`
- `POST /auth/login` and `POST /auth/register`

### Authentication

- Tokens are stored in localStorage after login.
- Util functions like `getAuthUser()` and `headers(true)` are used to handle authentication headers.

---

## Styling & UI

- Custom Tailwind colors and themes:
  - `--color-button-turq: #129990`
  - `--color-pagination: #90D1CA`
- Google Font: **Pacifico** for branding titles.
- Fully rounded buttons, smooth hover transitions, and soft shadows to enhance UX.

---
## Key Functional Examples

- **BookingCalendar.jsx**  
  Booked dates are disabled with a strike-through visual indicator using Tailwind and React Datepicker.

- **YourVenues.jsx**  
  Venue Managers can view their venues and dynamically fetch associated bookings. If no upcoming bookings exist, the message "No upcoming bookings" is shown.

- **Profile.jsx**  
  Profile info is editable. Success message on profile updates auto-disappears after 3 seconds.
