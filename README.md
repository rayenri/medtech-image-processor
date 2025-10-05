# MedTech Image Processor Frontend

React frontend for the MedTech surgical planning image processing application.

## Features

- Modern, responsive UI with drag-and-drop image upload
- Real-time image preview
- Phase selection (Arterial/Venous)
- Side-by-side image comparison
- Error handling and loading states

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the API URL in `.env` file:
```
REACT_APP_API_URL=http://localhost:7860
```

4. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json` homepage field with your GitHub Pages URL

3. Deploy:
```bash
npm run deploy
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:7860)

Update this to your Hugging Face Spaces URL when deploying.
