import { app } from "./app";
import { config } from "./config/config";
import { prisma } from "./lib/prisma";

const PORT = config.PORT;

async function start() {
    try {
        await prisma.$connect();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to the database");
        console.error(err);
        process.exit(1);
    }
}

start();