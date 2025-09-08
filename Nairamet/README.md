# Nairamet Project

Nairamet is a project designed to monitor exchange rates and manage alerts for users. This README provides an overview of the project structure, setup instructions, and usage guidelines.

## Project Structure

```
Nairamet
├── prisma
│   ├── schema.prisma       # Prisma schema definition
│   └── migrations           # Migration files for database
├── src
│   ├── hooks
│   │   └── use-rate-monitor.ts  # Custom hook for rate monitoring
│   └── index.ts             # Entry point for the application
├── package.json             # npm configuration file
├── tsconfig.json            # TypeScript configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd Nairamet
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up the database:**
   - Update the `DATABASE_URL` in your `.env` file with your database connection string.
   - Add the User model to `prisma/schema.prisma` and run the migration:
     ```
     npx prisma migrate dev --name init
     ```

4. **Run the application:**
   ```
   npm start
   ```

## Usage

- The application monitors exchange rates and triggers alerts based on user-defined conditions.
- Users can manage their alerts through the provided interface.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.