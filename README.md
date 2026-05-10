# School Management API

A Node.js + Express.js + MySQL API for managing schools.

## Features

- Add schools
- List schools sorted by proximity
- MySQL database integration
- Distance calculation using Haversine Formula

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2

---

## Installation

```bash
npm install
```

---

## Setup Environment Variables

Create `.env`


## Run Project

```bash
npm run dev
```

---

## API Endpoints

### Add School

POST `/addSchool`

Example Body:

```json
{
  "name": "ABC School",
  "address": "Kanpur",
  "latitude": 26.4499,
  "longitude": 80.3319
}
```

---

### List Schools

GET `/listSchools?latitude=26.4499&longitude=80.3319`

Returns schools sorted by distance.

---

## Author

 Mohammad Akbar Husain
