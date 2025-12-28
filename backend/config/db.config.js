const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Mongo connection failed", err.message);
    process.exit(1);
  }
};
