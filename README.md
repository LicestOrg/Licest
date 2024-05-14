# Licest

> [!WARNING]
> This project is still in early developpment.

## Description

Licest is an Web application that allows you to create and manage your lists with the most personalized way possible.

You can create lists with your favorite movies, series, books, games, and more. And in any type of list table, cards, or even Todo list.

The project is also oriented plugins friendly, so you can create your own plugins to extend the application, (like a plugin to import your data from other services) or any other extension that don't fit with the main objective of the Licest.

## How to install
```bash
git clone git@github.com:LicestOrg/Licest.git
cd Licest
git submodule update --init --recursive
```

## How to use

> [!WARNING]
> Set the environment variables in the `.env` file.

### For development

Start the postgresql server
```bash
sudo docker compose -f compose.yml up
```

Start the api server
```bash
cd api
npx prisma migrate dev --name init # Only the first time
npm ci
npm run start:dev
```

Start the frontend server
```bash
npm ci
npm run dev
```

### For production

```bash
sudo docker compose -f compose.yml -f compose.prod.yml up
```
