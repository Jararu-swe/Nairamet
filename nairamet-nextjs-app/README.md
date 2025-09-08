# Nairamet Next.js App

## Overview
This project is a Next.js application that implements authentication using NextAuth.js and connects to a database using Prisma. It supports authentication providers such as Email and Google.

## Project Structure
```
nairamet-nextjs-app
├── app
│   └── api
│       └── auth
│           └── [...nextauth]
│               └── route.ts
├── prisma
│   └── schema.prisma
├── src
│   ├── lib
│   │   └── prisma.ts
│   └── types
│       └── next-auth.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nairamet-nextjs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Update the database connection settings in the `.env` file.
   - Run the following command to create the database and apply the schema:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`.

## Usage Guidelines
- The application supports user registration and authentication via Email and Google.
- Ensure you have the necessary API keys for Google authentication and configure them in your environment variables.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes. 

## License
This project is licensed under the MIT License.