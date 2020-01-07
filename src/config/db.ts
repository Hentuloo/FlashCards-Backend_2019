import mongoose from "mongoose";
import env from "env";

export class DB {
  private static connection: typeof mongoose | null = null;

  static async connect(url: string): Promise<typeof mongoose> {
    this.connection = await mongoose.connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const connection = this.connection.connection;

    connection.on("error", () => {
      throw Error("error");
    });

    return this.connection;
  }
}

export default DB.connect(env.MONGODB_URL);
